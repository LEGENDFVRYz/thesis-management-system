<?php

namespace Tests;

use Database\Seeders\TestLookupSeeder;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Static lookup tables (faculty roles, specializations) that the Student/Faculty
     * model factories depend on transitively, so every RefreshDatabase test needs
     * them seeded, not just faculty- or student-specific ones.
     */
    protected $seeder = TestLookupSeeder::class;
}
