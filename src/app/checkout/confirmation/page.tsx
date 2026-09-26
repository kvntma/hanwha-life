'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Copy, Send, Mail, Check, Loader2, MapPin, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Order } from '@/types/order';
import { PAYMENT_CONFIG } from '@/constants/delivery';

export default function ConfirmationPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reference, setReference] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [supabase] = useState(() => createClient());

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
                if (data?.etransfer_reference) {
                    setIsSubmitted(true);
                    setReference(data.etransfer_reference);
                }
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
        toast.success(`${label} copied to clipboard!`);
    };

    const handleReferenceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reference || !orderId) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ etransfer_reference: reference.trim() })
                .eq('id', orderId);

            if (error) throw error;
            setIsSubmitted(true);
            toast.success('Interac reference submitted! We will match and verify your payment.');
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
            <div className="container py-24 px-4 max-w-xl mx-auto text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Order Not Found</h1>
                <p className="text-muted-foreground text-sm mb-6">We could not locate this order session.</p>
                <Link href="/products">
                    <Button className="font-bold uppercase tracking-wider text-xs">Return to Collection</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-12 px-4 max-w-3xl mx-auto">
            {/* Header Status */}
            <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-full bg-primary/10 border border-primary/30 mb-4 text-primary">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                    Order Reserved <span className="text-primary">& Queued</span>
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Tracking ID: <span className="font-mono font-bold text-foreground">{order.transaction_id}</span>
                </p>
            </div>

            {/* Delivery Destination Snapshot */}
            <Card className="mb-6 border-border bg-card/60">
                <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Drop Location</div>
                            <div className="font-medium text-foreground mt-0.5">{order.address}</div>
                            <div className="text-xs text-muted-foreground mt-1">Recipient: {order.full_name} ({order.phone})</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 border-t sm:border-t-0 sm:border-l sm:pl-4 pt-3 sm:pt-0 border-border">
                        <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Chosen Delivery Window</div>
                            <div className="font-medium text-foreground mt-0.5">{order.delivery_window}</div>
                            <div className="text-xs text-primary font-semibold mt-1">Driver will text prior to drop</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Interac E-Transfer Instructions */}
            <Card className="border-primary/30 shadow-xl overflow-hidden mb-8">
                <CardHeader className="bg-primary/10 pb-4 border-b border-primary/20">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                            <Send className="h-5 w-5 text-primary" />
                            Interac E-Transfer Payment Details
                        </CardTitle>
                        <span className="text-[11px] font-mono font-bold bg-primary/20 text-primary px-2.5 py-1 rounded-full uppercase">
                            Ontario Interac
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Please send your Interac E-Transfer to confirm your GTA drop slot.
                    </p>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Recipient Email */}
                        <div className="flex flex-col space-y-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Recipient Email
                            </span>
                            <div className="flex items-center justify-between p-3.5 bg-muted rounded-xl border border-border">
                                <span className="font-mono font-bold text-sm select-all">{PAYMENT_CONFIG.etransferEmail}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(PAYMENT_CONFIG.etransferEmail, 'Email')}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Exact Amount */}
                        <div className="flex flex-col space-y-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Total Amount to Send
                            </span>
                            <div className="flex items-center justify-between p-3.5 bg-muted rounded-xl border border-border">
                                <span className="font-mono font-black text-xl text-primary">${order.total_amount.toFixed(2)} CAD</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(order.total_amount.toFixed(2), 'Amount')}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Memo / Reference Code */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Crucial: Transfer Memo / Message
                            </span>
                            <span className="text-[11px] font-bold text-destructive">Required for verification</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/30">
                            <div>
                                <span className="font-mono font-black text-lg text-foreground">{order.transaction_id}</span>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    Include this exact reference in your banking app's memo field.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(order.transaction_id, 'Transfer reference')}
                                className="border-primary/40 font-bold"
                            >
                                <Copy className="h-4 w-4 mr-1.5" />
                                Copy Code
                            </Button>
                        </div>
                    </div>

                    {/* Autodeposit Notice & Security Q/A Fallback */}
                    <div className="p-4 rounded-xl bg-card border border-border text-xs space-y-2">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <span>Interac Autodeposit is Enabled</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Most Canadian financial institutions (RBC, TD, Scotiabank, BMO, CIBC, Tangerine, Simplii, Desjardins) will deposit automatically without requiring a security question.
                        </p>
                        <div className="border-t border-border pt-2 mt-2 text-[11px] text-muted-foreground">
                            If your credit union or banking portal insists on a question/password:
                            <span className="block mt-1 font-mono text-foreground font-semibold">
                                Question: <strong>{PAYMENT_CONFIG.fallbackQuestion}</strong> | Answer: <strong>{PAYMENT_CONFIG.fallbackAnswer}</strong>
                            </span>
                        </div>
                    </div>

                    {/* Bank Reference Submission */}
                    <div className="bg-muted/40 p-5 rounded-2xl border border-border space-y-3">
                        {isSubmitted ? (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-primary/10 rounded-xl border border-primary/20 text-center sm:text-left">
                                <div className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary shrink-0" />
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-primary">
                                            Bank Reference ID Logged
                                        </div>
                                        <div className="font-mono font-bold text-sm">{reference}</div>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-background border text-muted-foreground">
                                    Awaiting Admin Matching
                                </span>
                            </div>
                        ) : (
                            <form onSubmit={handleReferenceSubmit} className="space-y-3">
                                <div>
                                    <Label htmlFor="reference" className="text-xs font-bold uppercase tracking-wider text-foreground">
                                        Already Sent Transfer? Enter Bank Confirmation #
                                    </Label>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        Paste the confirmation number from your bank (e.g. CA123456789 or Interac Reference).
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        id="reference"
                                        placeholder="e.g. CA928174628"
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        className="bg-background font-mono text-sm uppercase"
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !reference.trim()}
                                        className="bg-primary hover:bg-primary/90 font-bold uppercase tracking-wider text-xs px-6"
                                    >
                                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Next Steps Guide */}
            <Card className="border-border mb-8">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold uppercase tracking-wider flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        What Happens Next in the GTA Drop Flow?
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                    <div className="flex items-start gap-2">
                        <span className="font-bold text-primary font-mono">01.</span>
                        <span>Our dispatch team matches your Interac transfer against reference <strong>{order.transaction_id}</strong>.</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="font-bold text-primary font-mono">02.</span>
                        <span>Your order changes to <strong>"Payment Verified"</strong> and is packed in temperature-controlled discrete packaging.</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="font-bold text-primary font-mono">03.</span>
                        <span>The local courier departs for your scheduled window: <strong>{order.delivery_window}</strong>.</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="font-bold text-primary font-mono">04.</span>
                        <span>Driver texts <strong>{order.phone}</strong> upon arrival. Drop completed!</span>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                    <Button variant="outline" className="w-full sm:w-auto font-bold uppercase text-xs tracking-wider">
                        Browse More Vials
                    </Button>
                </Link>
                <Link href="/orders">
                    <Button className="w-full sm:w-auto font-bold uppercase text-xs tracking-wider gap-2">
                        <Mail className="h-4 w-4" />
                        View Order Status
                    </Button>
                </Link>
            </div>
        </div>
    );
}
