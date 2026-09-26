'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Clock, MapPin, Send, CheckCircle2, Loader2, MessageSquare, Phone, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PAYMENT_CONFIG } from '@/constants/delivery';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [topic, setTopic] = useState('gta_drop');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    // Simulate support ticket dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      toast.success('Inquiry received! Our dispatch desk will reply within 2–4 hours.');
    }, 900);
  };

  return (
    <div className="container py-12 md:py-20 px-4 md:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
          Contact Dispatch <span className="text-primary">& Support</span>
        </h1>
        <p className="text-muted-foreground text-base md:text-lg font-medium leading-relaxed">
          Questions about GTA same-day drops, Interac payment verification, or bulk research orders? We are here 7 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Support Channels & Hub Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Direct Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider block">
                  Support & Orders
                </span>
                <a href={`mailto:${PAYMENT_CONFIG.supportEmail}`} className="font-mono font-bold text-foreground hover:text-primary transition-colors">
                  {PAYMENT_CONFIG.supportEmail}
                </a>
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider block">
                  Interac E-Transfer Verification
                </span>
                <span className="font-mono font-bold text-foreground">
                  {PAYMENT_CONFIG.etransferEmail}
                </span>
              </div>

              <div className="pt-2 border-t border-border">
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                  Operating Hours
                </span>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span>{PAYMENT_CONFIG.dispatchHours}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                  GTA Fulfillment Hub
                </span>
                <div className="flex items-start gap-2 text-foreground font-medium">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Greater Toronto Area, Ontario, Canada</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick FAQ Highlights */}
          <Card className="border-border bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                Frequently Asked
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <div>
                <strong className="text-foreground block">When does the driver reach out?</strong>
                Our courier will text your mobile phone ~15 minutes before arrival during your scheduled delivery window.
              </div>
              <div className="border-t border-border pt-2">
                <strong className="text-foreground block">How do I verify an Interac transfer?</strong>
                Submit your bank's reference number on the confirmation page or include your VIAL-XXXXXXXX order code in the transfer memo.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                Send a Transmission
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                All inquiries are encrypted and responded to by our local dispatch team.
              </p>
            </CardHeader>
            <CardContent>
              {isSent ? (
                <div className="py-16 text-center space-y-4">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 border border-primary/30 text-primary">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                    Transmission Sent
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Thank you, <strong>{name}</strong>. Your ticket has been routed to the GTA operations desk. We will get back to you via <strong>{email}</strong> shortly.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSent(false);
                      setMessage('');
                    }}
                    variant="outline"
                    className="font-bold uppercase tracking-wider text-xs mt-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider">
                        Your Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Dr. Jordan Miller"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jmiller@research.ca"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="topic" className="text-xs font-bold uppercase tracking-wider">
                        Topic of Inquiry
                      </Label>
                      <Select value={topic} onValueChange={setTopic}>
                        <SelectTrigger id="topic">
                          <SelectValue placeholder="Select topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gta_drop">GTA Local Drop Question</SelectItem>
                          <SelectItem value="payment_verification">Interac E-Transfer Verification</SelectItem>
                          <SelectItem value="order_status">Existing Order Status</SelectItem>
                          <SelectItem value="wholesale_lab">Bulk / Laboratory Inquiries</SelectItem>
                          <SelectItem value="other">Other General Inquiries</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orderId" className="text-xs font-bold uppercase tracking-wider">
                        Order # (Optional)
                      </Label>
                      <Input
                        id="orderId"
                        placeholder="e.g. VIAL-B82F1A0C"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Please specify your delivery address, question, or order details..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-10 py-6 text-base font-black uppercase italic tracking-tighter bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Transmit Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
