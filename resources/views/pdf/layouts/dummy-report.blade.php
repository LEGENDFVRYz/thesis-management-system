@extends('pdf.layout')

@section('content')
    <h2 class="text-xl font-bold mb-4">{{ $title }}</h2>

    <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-gray-800">
            <tr>
                <th class="border p-2 text-left text-white">ID</th>
                <th class="border p-2 text-left">Name</th>
                <th class="border p-2 text-left">Status</th>
                <th class="border p-2 text-left">Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $item)
            <tr class="even:bg-gray-50">
                <td class="border p-2">{{ $item->id }}</td>
                <td class="border p-2 font-bold">{{ $item->name }}</td>
                <td class="border p-2">
                    <span class="px-2 py-1 rounded text-xs {{ $item->status == 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800' }}">
                        {{ $item->status }}
                    </span>
                </td>
                <td class="border p-2">{{ $item->created_at->format('M d, Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
@endsection