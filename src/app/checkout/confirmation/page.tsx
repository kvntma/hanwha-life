'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Copy, Send, Mail, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Order } from '@/types/order';

export default function ConfirmationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');
    const total = searchParams.get('total');

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reference, setReference] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [supabase] = useState(() => createClient());

    // Fetch the order to get the transaction_id
    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', orderId)
                    .single();

                if (error) throw error;
                setOrder(data);
            } catch (error) {
                console.error('Error fetching order:', error);
                toast.error('Failed to load order details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, supabase]);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`);
    };

    const handleReferenceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reference || !orderId) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ etransfer_reference: reference })
                .eq('id', orderId);

            if (error) throw error;
            setIsSubmitted(true);
            toast.success('Reference submitted successfully!');
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to submit reference');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container py-16 px-4 max-w-2xl mx-auto text-center">
                <h1 className="text-2xl font-bold">Order not found</h1>
                <Link href="/products">
                    <Button className="mt-4">Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-16 px-4 max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Order Reserved!</h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Your shipment <strong>{order.transaction_id}</strong> is in the queue.
                </p>
            </div>

            <Card className="border-primary/20 shadow-lg overflow-hidden">
                <CardHeader className="bg-primary/5 text-center">
                    <CardTitle className="text-lg">Instructions for E-Transfer</CardTitle>
                    <p className="text-sm text-muted-foreground">Please send payment within 24 hours to confirm your order.</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recipient Email</span>
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
                                <span className="font-black italic">payments@beasttins.com</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard('payments@beasttins.com', 'Email')}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Amount to Send</span>
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
                                <span className="font-bold text-xl">${order.total_amount.toFixed(2)}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(order.total_amount.toString(), 'Amount')}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Message / Reference</span>
                            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                                <span className="font-mono font-bold">{order.transaction_id}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(order.transaction_id, 'Order reference')}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-red-500 font-medium italic">
                                * Crucial: You must include this code in your transfer message so we can verify your payment!
                            </p>
                        </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-xl space-y-4 border border-dashed">
                        {isSubmitted ? (
                            <div className="flex items-center gap-2 text-primary font-bold uppercase italic tracking-tighter justify-center py-2">
                                <Check className="h-5 w-5" />
                                Reference Submitted! We will verify it shortly.
                            </div>
                        ) : (
                            <form onSubmit={handleReferenceSubmit} className="space-y-3">
                                <Label htmlFor="reference" className="text-xs font-bold uppercase text-muted-foreground">
                                    Already sent it? Submit your Bank Reference ID
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="reference"
                                        placeholder="e.g. CA123456789"
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        className="bg-background"
                                        required
                                    />
                                    <Button type="submit" disabled={isSubmitting || !reference} size="sm">
                                        {isSubmitting ? '...' : 'Submit'}
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    This helps us match your payment faster.
                                </p>
                            </form>
                        )}
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Send className="h-4 w-4 text-primary" />
                            What's Next?
                        </h3>
                        <ol className="text-sm space-y-3 list-decimal list-inside text-muted-foreground font-medium">
                            <li>Open your banking app and send the E-Transfer.</li>
                            <li>Once we receive it, an admin will mark your order as <strong>"Verified"</strong>.</li>
                            <li>You will receive an email confirmation once we dispatch your tins.</li>
                            <li>Stay alert for your drop! ⚡</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <Link href="/products">
                    <Button variant="outline" className="w-full sm:w-auto">
                        Continue Shopping
                    </Button>
                </Link>
                <Link href="/orders">
                    <Button className="w-full sm:w-auto gap-2">
                        <Mail className="h-4 w-4" />
                        Check My Orders
                    </Button>
                </Link>
            </div>
        </div>
    );
}
