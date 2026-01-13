@extends('pdf.layout')

@section('content')

    {{-- === COVER PAGE === --}}
    <div class="cover-page page-break">
        <div class="cover-content">
            <h1 class="cover-title">
                {{ $title }}
            </h1>

            <p class="cover-subtitle">
                A Dummy Manuscript Generated for System Testing
            </p>

            <div class="cover-author">
                <p class="author-label">Author:</p>
                <p class="author-name">System Seeder Bot</p>
            </div>

            <p class="cover-generated">
                Generated: {{ now()->toDayDateTimeString() }}
            </p>
        </div>
    </div>

    {{-- === CHAPTERS LOOP === --}}
    @foreach($chapters as $chapter)
        <div class="chapter page-break">
            
            {{-- Chapter Header --}}
            <div class="chapter-header">
                <h2 class="chapter-number">
                    Chapter {{ $chapter['number'] }}
                </h2>
                <h3 class="chapter-title">
                    {{ $chapter['title'] }}
                </h3>
            </div>

            {{-- Chapter Parts --}}
            @foreach($chapter['parts'] as $part)
                <div class="chapter-part">
                    <h4 class="part-title">
                        {{ $part['title'] }}
                    </h4>
                    <p class="part-content">
                        {{ $part['content'] }}
                    </p>
                </div>
            @endforeach

        </div>
    @endforeach
@endsection

<style>
    /* ===============================
    BASE PDF SETTINGS
    =============================== */
    html {
        font-size: 18px; /* Base scale */
    }

    .page-break {
        page-break-after: always;
    }

    /* ===============================
    COVER PAGE
    =============================== */

    .cover-page {
        width: 100%;
        height: 600px;
        text-align: center;

        display: block;
    }

    .cover-content {
        margin-top: 200px;
        padding-left: 48px;
        padding-right: 48px;
    }

    .cover-title {
        font-size: 36px;
        font-weight: bold;
        text-transform: uppercase;
        line-height: 1.2;
        margin-bottom: 16px;
    }

    .cover-subtitle {
        font-size: 18px;
        font-style: italic;
        color: #6B7280; /* gray-500 */
        margin-bottom: 32px;
    }

    .cover-author {
        width: 50%;
        margin: 40px auto 0 auto;
        padding-bottom: 16px;
        border-top: 1px solid #D1D5DB;
        border-bottom: 1px solid #D1D5DB;
    }

    .author-label {
        font-size: 16px;
        font-weight: bold;
        margin-top: 12px;
    }

    .author-name {
        font-size: 16px;
    }

    .cover-generated {
        font-size: 14px;
        color: #9CA3AF; /* gray-400 */
        margin-top: 32px;
    }

    /* ===============================
    CHAPTERS
    =============================== */

    .chapter {
        padding-top: 16px;
    }

    /* Header */
    .chapter-header {
        margin-top: 16px;
        margin-bottom: 32px;
        padding-bottom: 8px;
        border-bottom: 2px solid #111827;
    }

    .chapter-number {
        font-size: 32px;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 8px;
    }

    .chapter-title {
        font-size: 24px;
        color: #4B5563;
        margin-bottom: 16px;
    }

    /* Parts */
    .chapter-part {
        margin-bottom: 24px;
    }

    .part-title {
        font-size: 20px;
        font-weight: bold;
        color: #111827;
        margin-bottom: 8px;
    }

    .part-content {
        font-size: 16px;
        line-height: 1.5;
        color: #4B5563;
        text-align: justify;
        margin-bottom: 16px;
    }
</style>
