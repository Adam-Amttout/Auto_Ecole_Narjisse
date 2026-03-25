<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;

class TestController extends Controller
{
    public function testEmail()
    {
        Mail::raw('Test email from Laravel 🚀', function ($message) {
            $message->to('adilaitelmoudden44@gmail.com')
                    ->subject('Test Email');
        });

        return "Email sent!";
    }
}