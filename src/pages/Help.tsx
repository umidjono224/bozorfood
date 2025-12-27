import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

export default function Help() {
  const phoneNumber = "+998940051639";

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Yordam" />
      
      <PageContainer className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-primary animate-bounce-light">
            <Phone className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Yordam kerakmi?
          </h2>
          <p className="text-muted-foreground mb-8">
            Savollar yoki muammolar bo'lsa, biz bilan bog'laning
          </p>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-card mb-6">
            <p className="text-sm text-muted-foreground mb-2">Yordam uchun raqam:</p>
            <p className="text-2xl font-bold text-foreground">{phoneNumber}</p>
          </div>

          <Button size="lg" className="w-full" onClick={handleCall}>
            <Phone className="w-5 h-5 mr-2" />
            Qo'ng'iroq qilish
          </Button>

          <p className="text-xs text-muted-foreground mt-6">
            Ish vaqti: 09:00 - 22:00
          </p>
        </div>
      </PageContainer>
    </div>
  );
}
