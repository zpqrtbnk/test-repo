<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        use App\Models\Student;
        use App\Models\Subject;
        use Faker\Factory as Faker;

        $faker = Faker::create();

        // Create 10 students
        for ($i = 0; $i < 10; $i++) 
        {
            $student = new Student();
            $student->firstname = $faker->firstName;
            $student->lastname = $faker->lastName;
            $student->birthdate = $faker->date;
            $student->sex = $faker->randomElement(['MALE', 'FEMALE']);
            $student->address = $faker->address;
            $student->year = $faker->numberBetween(1, 4);
            $student->course = $faker->randomElement(['BSIT', 'BSCS', 'BSIS']);
            $student->section = $faker->randomElement(['A', 'B', 'C']);
            $student->save();

            // Create 3 subjects for each student
            for ($j = 0; $j < 3; $j++) 
            {
                $subject = new Subject();
                $subject->student_id = $student->id;
                $subject->subject_code = $faker->bothify('T3B-###');
                $subject->name = $faker->sentence;
                $subject->description = $faker->paragraph;
                $subject->instructor = $faker->name;
                $subject->schedule = $faker->time;
                $subject->grades = [
                    'prelims' => $faker->randomFloat(1, 4, 2),
                    'midterms' => $faker->randomFloat(1, 4, 2),
                    'pre_finals' => $faker->randomFloat(1, 4, 2),
                    'finals' => $faker->randomFloat(1, 4, 2),
                ];
                $subject->average_grade = array_sum($subject->grades) / count($subject->grades);
                $subject->remarks = $subject->average_grade >= 3.0 ? 'PASSED' : 'FAILED';
                $subject->date_taken = $faker->date;
                $subject->save();
            }      
        }
    }
}
