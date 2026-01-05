<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AcademicYearAnnounced extends Notification
{
    use Queueable;

    public $semester;

    /**
     * Create a new notification instance.
     */
    public function __construct($semester)
    {
        $this->semester = $semester;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'New Academic Year Updated',
            'message' => sprintf(
                'The academic year S.Y. %02d%02d SEM%d has been set. Check your dashboard for details.',
                $this->semester->schoolYear->year % 100,
                ($this->semester->schoolYear->year + 1) % 100,
                $this->semester->semester + 1,
            ),
            'action_url' => route('admin.dashboard'),   
            'type' => 'schedule',                       
        ];
    }
}
