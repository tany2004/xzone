-- AddForeignKey
ALTER TABLE "Blacklist" ADD CONSTRAINT "Blacklist_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
