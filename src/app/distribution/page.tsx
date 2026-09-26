import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, MapPin, Clock, ShieldCheck, Zap, ArrowRight, PhoneCall, CheckCircle2, Navigation } from 'lucide-react';
import Link from 'next/link';
import { GTA_DELIVERY_WINDOWS, GTA_REGIONS, PAYMENT_CONFIG } from '@/constants/delivery';

export const metadata = {
  title: 'GTA Local Drops & Distribution Network | VialSupply',
  description: 'Fast, discreet local peptide drop delivery across the Greater Toronto Area and express tracked shipping throughout Ontario.',
};

export default function DistributionPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 w-full border-b border-border bg-gradient-to-b from-background via-card to-background flex justify-center">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border border-primary/30 py-1.5 px-6 text-xs font-bold uppercase tracking-widest">
            Ontario Fast Logistics
          </Badge>
          <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-6 text-foreground">
            The GTA Local <span className="text-primary">Drop Network</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Engineered for speed, discretion, and biological integrity. Direct-to-door temperature-protected peptide drops across Toronto, Peel, York, Halton, and Durham.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="rounded-full px-10 py-7 text-base font-black uppercase italic tracking-tighter bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
                Order Local Drop <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-7 text-base font-bold uppercase text-xs tracking-wider">
                Contact Dispatch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="py-16 w-full border-b border-border bg-card/40">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-start">
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Same-Day Evening Rush</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Orders placed before 2:00 PM EST qualify for our same-day 6:00 PM – 9:30 PM evening drop window across all central GTA zones.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-start">
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">100% Discrete Protocol</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Neutral, tamper-sealed, and unbranded outer packaging. Couriers operate with total discretion. Concierge and porch drops supported.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-start">
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-4">
                <Navigation className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Real-Time Driver Alerts</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Drivers text or call your mobile number 10–15 minutes prior to drop-off so you can receive your vials without delay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GTA Delivery Windows Schedule */}
      <section className="py-20 w-full">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-3">
              Delivery Windows <span className="text-primary">& Cutoffs</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Select your preferred drop window during checkout. Our dispatch fleet coordinates routes across the GTA grid daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GTA_DELIVERY_WINDOWS.map((window) => (
              <Card key={window.id} className="border-border hover:border-primary/40 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={window.isGtaLocal ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted'}>
                      {window.isGtaLocal ? 'GTA Local Drop' : 'Ontario Courier'}
                    </Badge>
                    <span className="font-mono font-bold text-xs text-foreground bg-muted px-2.5 py-1 rounded">
                      {window.timeSlot}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-black uppercase italic tracking-tighter mt-2">
                    {window.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">{window.description}</p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary pt-2 border-t border-border">
                    <Clock className="h-4 w-4" />
                    <span>Cutoff: {window.cutoff}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Regions */}
      <section className="py-20 w-full bg-card/60 border-t border-border">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-3">
              GTA Coverage <span className="text-primary">Zones</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Active same-day and scheduled drop coverage across the Greater Toronto Area.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GTA_REGIONS.map((region) => (
              <Card key={region.name} className="border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-black uppercase italic tracking-tight flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {region.name}
                    </CardTitle>
                  </div>
                  <span className="text-[11px] font-bold text-primary">{region.status}</span>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">
                      Included Cities
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {region.cities.map((city) => (
                        <span key={city} className="text-xs px-2 py-0.5 rounded-md bg-muted border border-border font-medium">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Postal prefixes: {region.postalPrefixes.slice(0, 4).join(', ')}...
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Rest of Ontario */}
            <Card className="border-border sm:col-span-2 lg:col-span-1 bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-black uppercase italic tracking-tight flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  Outside the GTA?
                </CardTitle>
                <span className="text-[11px] font-bold text-foreground">Ontario-Wide Courier</span>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  We provide 1–2 business day tracked insulated courier delivery to Ottawa, London, Hamilton, Kitchener-Waterloo, Kingston, Windsor, and Northern Ontario.
                </p>
                <div className="text-xs font-bold text-primary">
                  Select "Ontario Regional Tracked Courier" at checkout.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interac E-Transfer & Payment Process */}
      <section className="py-20 w-full border-t border-border">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <Card className="border-primary/30 bg-primary/5 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                  Ontario Interac E-Transfer Payment
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl">
                  We operate exclusively on Interac E-Transfer. Autodeposit is active on our registered Canadian business account, ensuring instant confirmation and immediate drop dispatch.
                </p>
              </div>
              <Link href="/products" className="shrink-0">
                <Button size="lg" className="font-black uppercase italic tracking-tighter bg-primary hover:bg-primary/90 text-white px-8 py-6">
                  Shop Collection
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
