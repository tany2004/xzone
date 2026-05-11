"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { AddToBlacklistModal } from "./AddToBlacklistModal";


export default function ManageBlacklistClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const { data, refetch } = api.blacklist.getAll.useQuery({
    page,
    limit: 20,
    search: search || undefined,
  });

  const utils = api.useUtils();

  const remove = api.blacklist.remove.useMutation({
    onSuccess: () => {
      setConfirmRemoveId(null);
      void refetch();
      void utils.admin.getBookings.invalidate(); // ← добавить
    },
  });

  const inputClass =
    "rounded-sm border border-[#1e1540] bg-[#120e24] px-3 py-2 text-sm text-violet-200 focus:border-violet-500 focus:outline-none hover:border-violet-700/50 transition-colors placeholder:text-violet-300/20";

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[2px] text-teal-500">
        Администрирование
      </p>
      <h1 className="mt-2 text-2xl font-bold text-white">Чёрный список</h1>

      {/* Тулбар */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Поиск по имени или телефону..."
          className={`${inputClass} w-72`}
        />
        <button
          onClick={() => setModalOpen(true)}
          className="ml-auto rounded-sm px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:brightness-125"
          style={{ background: "linear-gradient(90deg, #7c3aed, #0d9488)" }}
        >
          + Добавить вручную
        </button>
      </div>

      {/* Таблица */}
      <div className="mt-6 overflow-x-auto rounded-sm border border-[#1e1540]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1540] bg-[#120e24]">
              {["Клиент", "Телефон", "Причина", "Неявки", "Добавил", "Дата", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium text-violet-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data?.items.length && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-violet-300/30">
                  Список пуст
                </td>
              </tr>
            )}
            {data?.items.map((entry: any, i: any) => (
              <tr
                key={entry.id}
                className={`border-b border-[#1e1540] last:border-0 transition-colors hover:bg-violet-500/5 ${
                  i % 2 === 0 ? "bg-[#0e0b1a]" : "bg-[#120e24]"
                }`}
              >
                <td className="px-4 py-3 text-white">{entry.clientName}</td>
                <td className="px-4 py-3 font-mono text-xs text-violet-300/60">
                  {entry.clientPhone}
                </td>
                <td className="max-w-[200px] px-4 py-3 text-violet-300/50">
                  {entry.reason ?? <span className="text-violet-300/20">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-sm border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-400">
                    {entry.noShowCount}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-violet-300/40">
                  {entry.admin.login}
                </td>
                <td className="px-4 py-3 text-xs text-violet-300/40">
                  {new Date(entry.addedAt).toLocaleDateString("ru-RU")}
                </td>
                <td className="px-4 py-3">
                  {confirmRemoveId === entry.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => remove.mutate({ id: entry.id })}
                        className="rounded-sm border border-red-500/30 bg-red-500/15 px-2.5 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/25"
                      >
                        Точно удалить
                      </button>
                      <button
                        onClick={() => setConfirmRemoveId(null)}
                        className="rounded-sm border border-[#1e1540] px-2.5 py-1 text-xs text-violet-300/40 transition-colors hover:text-violet-300"
                      >
                        Отмена
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmRemoveId(entry.id)}
                      className="rounded-sm border border-violet-500/10 bg-violet-500/5 px-2.5 py-1 text-xs text-violet-300/40 transition-colors hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-400/70"
                    >
                      Удалить
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      {data && data.pages > 1 && (
        <div className="mt-4 flex items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-sm border border-[#1e1540] px-3 py-1.5 text-xs text-violet-300/50 transition-colors hover:border-violet-700/50 hover:text-violet-300 disabled:opacity-30"
          >
            ← Назад
          </button>
          <span className="text-xs text-violet-300/30">
            {page} / {data.pages}
          </span>
          <button
            disabled={page === data.pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-sm border border-[#1e1540] px-3 py-1.5 text-xs text-violet-300/50 transition-colors hover:border-violet-700/50 hover:text-violet-300 disabled:opacity-30"
          >
            Вперёд →
          </button>
        </div>
      )}

      <AddToBlacklistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => void refetch()}
      />
    </div>
  );
}