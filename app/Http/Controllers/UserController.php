<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

public function index(Request $request)
{
    $query = Student::query();

    if ($request->has('name')) {
        $query->where('firstname', 'like', "%{$request->input('name')}%")
            ->orWhere('lastname', 'like', "%{$request->input('name')}%");
    }

    if ($request->has('year')) {
        $query->where('year', $request->input('year'));
    }

    if ($request->has('course')) {
        $query->where('course', $request->input('course'));
    }

    if ($request->has('section')) {
        $query->where('section', $request->input('section'));
    }

    $students = $query->get();

    return response()->json($students);
}

use Illuminate\Http\Request;
use App\Models\Survey;

public function index(Request $request)
{
    $startDate = $request->query('start_date');
    $endDate = $request->query('end_date');
    $status = $request->query('status');
    $tags = $request->query('tags');
    $sortBy = $request->query('sort');

    $query = Survey::query();

    if ($startDate && $endDate) {
        $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    if ($status) {
        $query->where('status', $status);
    }

    if ($tags) {
        $query->whereHas('tags', function ($query) use ($tags) {
            $query->whereIn('name', explode(',', $tags));
        });
    }

    if ($sortBy) {
        $sortFields = explode(':', $sortBy);
        $sortField = $sortFields[0];
        $sortDirection = $sortFields[1] ?? 'asc';

        $query->orderBy($sortField, $sortDirection);
    }

    $surveys = $query->get();

    return response()->json($surveys);
}