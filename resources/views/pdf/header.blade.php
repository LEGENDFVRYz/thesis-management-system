
{{-- Stylings --}}
<style>
    .pdf-header {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 15px;
        padding-bottom: 16px;
        border-bottom: 1px solid #D1D5DB;
        height: 80px;
        
        /* Typography */
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.25;

        /* Spacing */
        margin: 10px 40px 0 40px;
    }

    .pdf-logo {
        flex-shrink: 0; 
        width: 80px;
        height: 80px;
        border-radius: 50%;

        background: linear-gradient(to bottom right, #D1D5DB, #9CA3AF);

        display: flex;
        align-items: center;
        justify-content: center;

        font-family: Arial, sans-serif;
        font-weight: bold;
        font-size: 16px;
        color: #746464;

        /* CRITICAL FOR PDF: Forces the background/gradient to print */
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    .pdf-details {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .pdf-text-primary {
        font-weight: 500;
        color: #1F2937;
        font-size: 14px;
        line-height: 1.25;
    }

    .pdf-text-secondary {
        font-weight: 700;
        color: #111827;
        font-size: 18px;
        line-height: 1.25;
        margin-top: 2px;
    }
</style>

<div class="pdf-header">
    {{-- Logo Section --}}
    <div class="pdf-logo">
        LOGO
    </div>

    {{-- Details Section --}}
    <div class="pdf-details">
        <span class="pdf-text-primary">POLYTECHNIC UNIVERSITY OF THE PHILIPPINES</span>
        <span class="pdf-text-primary">COLLEGE OF ENGINEERING</span>
        <span class="pdf-text-secondary">COMPUTER ENGINEERING DEPARTMENT</span>
    </div>
</div>