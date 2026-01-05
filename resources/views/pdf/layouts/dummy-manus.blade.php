@extends('pdf.layout')

@section('content')

    {{-- === COVER PAGE === --}}
    <div class="w-full flex flex-col items-center justify-center text-center page-break" style="height:600px;">
        <div style="margin-top: 200px;">
            <h1 class="font-bold uppercase mb-4 text-center" style="font-size:36px; line-height:1.2; padding-left:48px; padding-right:48px;">
                {{ $title }}
            </h1>
            <p class="text-gray-500 italic mb-8" style="font-size:18px; line-height:1.4;">
                A Dummy Manuscript Generated for System Testing
            </p>
            
            <div class="border-t border-b w-1/2 mx-auto" style="border-color:#D1D5DB; margin-top:40px; padding-bottom:16px;">
                <p style="font-weight:bold; font-size:16px;">Author:</p>
                <p style="font-size:16px;">System Seeder Bot</p>
            </div>

            <p class="mt-8 text-gray-400" style="font-size:14px; margin-top:32px;">
                Generated: {{ now()->toDayDateTimeString() }}
            </p>
        </div>
    </div>

    {{-- === CHAPTERS LOOP === --}}
    @foreach($chapters as $chapter)
        <div class="page-break">
            {{-- Chapter Header --}}
            <div class="mb-8 mt-4 border-b-2 pb-2" style="border-color:#111827;">
                <h2 style="font-size:32px; font-weight:bold; text-transform:uppercase; margin-bottom:8px;">
                    Chapter {{ $chapter['number'] }}
                </h2>
                <h3 style="font-size:24px; color:#4B5563; margin-bottom:16px;">
                    {{ $chapter['title'] }}
                </h3>
            </div>

            {{-- Chapter Parts --}}
            @foreach($chapter['parts'] as $part)
                <div class="mb-6">
                    <h4 style="font-size:20px; font-weight:bold; margin-bottom:8px; color:#111827;">
                        {{ $part['title'] }}
                    </h4>
                    <p style="font-size:16px; line-height:1.5; color:#4B5563; text-align:justify; margin-bottom:16px;">
                        {{ $part['content'] }}
                    </p>
                </div>
            @endforeach
        </div>
    @endforeach

@endsection

<style>
    .page-break { page-break-after: always; }

    html {
        font-size: 18px; /* Base font size for rem scaling in PDF */
    }
</style>
