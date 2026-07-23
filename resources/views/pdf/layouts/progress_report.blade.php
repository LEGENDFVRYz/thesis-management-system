<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Thesis Progress Report</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 12px; color: #111; line-height: 1.4; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        
        /* HEADER STYLES */
        .header-title { font-size: 18px; font-weight: bold; color: #000; }
        
        /* TABLE STYLES (UNIFIED DESIGN) */
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        
        /* The Maroon Header Bar */
        .section-header-bar {
            background-color: #730000;
            color: white;
            padding: 6px;
            text-align: center;
            font-weight: bold;
            margin-top: 15px;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }

        /* The Gold/Beige Sub-headers */
        .summary-gold-header {
            background-color: #E2D9B7; /* Gold/Beige */
            color: #000;
            font-weight: bold;
            text-align: center;
            padding: 5px;
            border: 1px solid #999;
            font-size: 11px;
        }

        .summary-table td {
            border: 1px solid #ccc;
            padding: 5px;
            text-align: center;
            font-size: 11px;
        }

        .total-row td {
            background-color: #f0f0f0;
            font-weight: bold;
            border-top: 2px solid #999;
        }
        
        /* SIGNATURES */
        .signature-section { margin-top: 50px; page-break-inside: avoid; }
        .signature-box { width: 45%; float: left; }
        .signature-box:last-child { float: right; }
        .sign-line { border-bottom: 1px solid #000; width: 80%; margin-top: 30px; margin-bottom: 5px; }
    </style>
</head>
<body>

    <div class="text-left mb-4">
        <div class="header-title">
            {{ $type === 'monthly' ? 'Monthly Progress Report' : 'Academic Year Thesis Summary Report' }}
        </div>
        <div style="font-size: 12px; margin-top: 2px;">{{ $filters['department'] }}</div>
        <div style="font-size: 12px;">Academic Year: {{ $filters['year'] }}</div>
        <div style="font-size: 11px; margin-top: 2px;">Date Generated: {{ $filters['generated_at'] }}</div>
    </div>

    {{-- ============================================================== --}}
    {{-- TYPE 1: MONTHLY REPORT (Now follows Summary Design) --}}
    {{-- ============================================================== --}}
    @if($type === 'monthly')
        
        @foreach($data as $month => $rows)
            {{-- Only show month if data exists --}}
            @if(count($rows) > 0)
                <div class="section-header-bar">{{ $month }}</div>
                <table class="summary-table">
                    <thead>
                        <tr>
                            <th class="summary-gold-header" style="width: 10%">Course</th>
                            <th class="summary-gold-header">Groups</th>
                            <th class="summary-gold-header">Proposals</th>
                            <th class="summary-gold-header">Thesis</th>
                            <th class="summary-gold-header">Endorsed</th>
                            <th class="summary-gold-header">Scheduled</th>
                            <th class="summary-gold-header">Panels</th>
                            <th class="summary-gold-header">Evaluated</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($rows as $row)
                        <tr>
                            <td class="font-bold">{{ $row['course'] }}</td>
                            <td>{{ $row['groups'] }}</td>
                            <td>{{ $row['proposals'] }}</td>
                            <td>{{ $row['thesis'] }}</td>
                            <td>{{ $row['endorsed'] }}</td>
                            <td>{{ $row['scheduled'] }}</td>
                            <td>{{ $row['panels'] }}</td>
                            <td>{{ $row['evaluated'] }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        @endforeach

    {{-- ============================================================== --}}
    {{-- TYPE 2: SUMMARY REPORT --}}
    {{-- ============================================================== --}}
    @else

        {{-- 1. Executive Summary --}}
        <div class="section-header-bar">Executive Summary</div>
        <table class="summary-table">
            <thead>
                <tr>
                    @if($filters['include_submissions']) <th class="summary-gold-header">Total Submissions</th> @endif
                    @if($filters['include_completions']) <th class="summary-gold-header">Total Completions</th> @endif
                    <th class="summary-gold-header">Completion Rate</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    @if($filters['include_submissions']) <td>{{ $data['total_submissions'] }}</td> @endif
                    @if($filters['include_completions']) <td>{{ $data['total_completed'] }}</td> @endif
                    <td>{{ $data['completion_rate'] }}</td>
                </tr>
            </tbody>
        </table>

        {{-- 2. Section-Level Breakdown (With Totals) --}}
        <div class="section-header-bar">Section-Level Breakdown</div>
        
        @foreach($data['section_breakdown'] as $courseName => $sections)
            @if(count($sections) > 0)
                {{-- Init Totals for this Course --}}
                @php 
                    $subTotal = 0; 
                    $compTotal = 0; 
                @endphp

                <div style="background-color: #eee; color: #730000; padding: 2px 10px; font-weight: bold; font-size: 11px; border: 1px solid #ccc; border-bottom: none;">
                    {{ $courseName }}
                </div>
                <table class="summary-table" style="margin-top: 0;">
                    <thead>
                        <tr>
                            <th class="summary-gold-header" style="width: 30%">Section</th>
                            @if($filters['include_submissions']) <th class="summary-gold-header">Submissions</th> @endif
                            @if($filters['include_completions']) <th class="summary-gold-header">Completed</th> @endif
                            <th class="summary-gold-header">Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($sections as $sec)
                        @php 
                            $subTotal += $sec['submissions']; 
                            $compTotal += $sec['completed']; 
                        @endphp
                        <tr>
                            <td class="text-left">{{ $sec['section'] }}</td>
                            @if($filters['include_submissions']) <td>{{ $sec['submissions'] }}</td> @endif
                            @if($filters['include_completions']) <td>{{ $sec['completed'] }}</td> @endif
                            <td>{{ $sec['rate'] }}</td>
                        </tr>
                        @endforeach
                        
                        {{-- FIX 4: Total Row for this Course Group --}}
                        <tr class="total-row">
                            <td class="text-right">TOTAL</td>
                            @if($filters['include_submissions']) <td>{{ $subTotal }}</td> @endif
                            @if($filters['include_completions']) <td>{{ $compTotal }}</td> @endif
                            <td>{{ $subTotal > 0 ? round(($compTotal / $subTotal) * 100) . '%' : '0%' }}</td>
                        </tr>
                    </tbody>
                </table>
            @endif
        @endforeach

    @endif

    {{-- FOOTER SIGNATURES --}}
    <div class="signature-section">
        <div class="signature-box">
            <p>Prepared by:</p>
            <div class="sign-line"></div>
            <strong>{{ $filters['coordinator'] }}</strong><br>
            <span style="font-size: 11px; color: #555;">Coordinator, CPE Research Committee</span>
        </div>
        <div class="signature-box">
            <p>Noted by:</p>
            <div class="sign-line"></div>
            <strong>{{ $filters['chairperson'] }}</strong><br>
            <span style="font-size: 11px; color: #555;">Chairperson, CPE Chairperson</span>
        </div>
        <div style="clear: both;"></div>
    </div>

</body>
</html>