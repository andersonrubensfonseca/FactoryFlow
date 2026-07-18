<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderShippingUpdated extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    private const SUBJECTS = [
        'posted' => 'Seu pedido #:id foi postado',
        'delivered' => 'Seu pedido #:id foi entregue',
        'cancelled' => 'O envio do pedido #:id foi cancelado',
        'expired' => 'O envio do pedido #:id expirou',
    ];

    /**
     * Create a new message instance.
     */
    public function __construct(public Order $order)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = self::SUBJECTS[$this->order->shipping_status] ?? "Atualização do pedido #{$this->order->id}";

        return new Envelope(
            subject: str_replace(':id', (string) $this->order->id, $subject),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.orders.shipping-updated',
            with: ['order' => $this->order],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
