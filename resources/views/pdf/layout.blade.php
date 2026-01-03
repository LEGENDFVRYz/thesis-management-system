<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Report</title>

    {{-- 
        STYLE INJECTION:
        - Use ONLY compiled Vite CSS
        - Read hashed file via manifest.json
        - Inline CSS for Browsershot compatibility
    --}}
    @php
        $manifestPath = public_path('build/manifest.json');

        if (! file_exists($manifestPath)) {
            throw new RuntimeException('Vite manifest not found. Run npm run build.');
        }

        $manifest = json_decode(file_get_contents($manifestPath), true);

        if (! isset($manifest['resources/js/app.tsx']['css'][0])) {
            throw new RuntimeException('CSS entry not found in Vite manifest.');
        }

        $cssFile = public_path('build/' . $manifest['resources/js/app.tsx']['css'][0]);
    @endphp


    <style>
        {!! file_get_contents($cssFile) !!}

        /* ===============================
            PDF-SPECIFIC OVERRIDES
        =============================== */
        body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-family: sans-serif;
        }

        .page-break {
            page-break-after: always;
        }

        tr {
            page-break-inside: avoid;
        }

        thead {
            display: table-header-group;
        }
    </style>
</head>
<body class="text-black text-2md">
    
    {{-- Header --}}
    <div class="mb-8 border-b pb-4">
        <h1 class="text-2xl font-bold uppercase">Department Report</h1>
        <div class="text-gray-500 text-xs">
            Generated: {{ now()->toFormattedDateString() }}
        </div>
    </div>

    {{-- Content Slot --}}
    @yield('content')

</body>
</html>