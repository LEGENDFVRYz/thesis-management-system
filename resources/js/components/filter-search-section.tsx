import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SearchBar } from '@/components/filter-search'

export default function SearchSection() {
  return (
    /* 1. Main Container (filter_search specs) */
    <div className="flex flex-col items-start p-[24.8px_24.8px_0.8px_24.8px] gap-4 w-full max-w-[1360px] h-auto lg:h-[125.6px] bg-white border-[0.8px] border-[#73000033] rounded-[10px] shadow-sm self-stretch">
      
      {/* 2. Title Row (Title-cont) */}
      <div className="flex flex-row items-center gap-2 self-stretch w-full h-6">
        <Filter className="w-5 h-5 text-[#730000]" />
        <h2 className="font-['Arimo'] text-[16px] text-[#730000]">Filters & Search</h2>
      </div>

      {/* 3. Search & Filter Row (The Row for the SearchBar) */}
      <div className="flex flex-row items-center gap-[10px] self-stretch w-full h-9">
        
        {/* --- CALL THE FUNCTION HERE --- */}
        <div className="flex-grow">
           <SearchBar />
        </div>
        {/* ------------------------------ */}

        {/* 4. Secondary Filter Icon Button */}
        <Button className="w-9 h-9 bg-[#F3EFD0] rounded-lg border-none flex-none flex items-center justify-center">
          <Filter className="w-4 h-4 text-[#730000]" />
        </Button>

        {/* 5. Reject Button (negative_buttons) */}
        <Button className="bg-[#9B000A] text-white h-9 w-[101px] rounded-lg text-[13.33px] font-medium flex-none">
          Reject
        </Button>
      </div>
    </div>
  );
}