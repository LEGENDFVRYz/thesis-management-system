<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FileUploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'max:25600',            // 25MB (kb) --note: not sure if ilan pa max
                'mimes:csv,xlsx,xls',   // formats   --note: based palang student batch import as of now
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Please upload a file.',
            'file.max'      => 'The file size cannot exceed 25 MB.',
            'file.mimes'    => 'Only .csv, .xlsx, and .xls files are supported.',
        ];
    }
}
