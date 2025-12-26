import React, { useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet"; // adjust path

export default function DialogTest() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div style={{ padding: 40, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Dialog Test */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Preview</DialogTitle>
            <DialogDescription>
              If you see this modal, your dialog component is working.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="secondary">Cancel</Button>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sheet Test */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button>Open Sheet</Button>
        </SheetTrigger>

        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Sheet Preview</SheetTitle>
            <SheetDescription>
              If you see this panel, your sheet component is working.
            </SheetDescription>
          </SheetHeader>

          <div style={{ padding: 16 }}>
            <p>Here is some content inside the sheet.</p>
            <p>You can add forms, buttons, or anything else here.</p>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button>Close Sheet</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
