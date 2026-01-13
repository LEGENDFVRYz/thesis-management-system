<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PDF Report</title>

        <style>
            /* ===============================
                PDF-SPECIFIC OVERRIDES
            =============================== */
            body {
                margin: 0;
                padding: 0;
                color: #000000;               
                font-family: Arial, Helvetica, sans-serif;
                font-size: 16px;
                line-height: 1.5;

                /* Ensure colors render correctly in PDFs */
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            /* ===============================
            TYPOGRAPHY HELPERS
            =============================== */

            h1 {
                font-size: 28px;
                margin: 0 0 16px 0;
            }

            h2 {
                font-size: 22px;
                margin: 0 0 14px 0;
            }

            h3 {
                font-size: 18px;
                margin: 0 0 12px 0;
            }

            p {
                margin: 0 0 12px 0;
            }

            /* ===============================
            TABLE FOR PDF
            =============================== */

            table {
                width: 100%;
                border-collapse: collapse;
            }

            thead {
                display: table-header-group;
            }

            tr {
                page-break-inside: avoid;
            }

            th,
            td {
                padding: 8px;
                text-align: left;
                vertical-align: top;
            }

            /* ===============================
            PAGE CONTROL
            =============================== */
            .page-break {
                page-break-after: always;
            }
        </style>
    </head>
    <body>
        {{-- Content Slot --}}
        @yield('content')

    </body>
</html>