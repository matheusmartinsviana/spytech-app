"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { handleSignIn } from "@/lib/auth/auth";
import Image from "next/image";

export default function Register() {
    const currentYear = new Date().getFullYear();

    const heading = "Criar Conta";
    const subheading = "Comece sua jornada com a gente!";
    const logo = {
        url: "https://spytech.mgtechbr.com/",
        src: "https://spytech.mgtechbr.com/icons/icon.png",
        alt: "Spy Tech",
    };
    const registerText = "Cadastrar";
    const googleText = "Cadastrar com o Google";
    const loginText = "Já possui uma conta?";
    const loginUrl = "/";

    return (
        <section className="py-32 mx-auto flex h-screen w-full items-center justify-center bg-background">
            <div className="container">
                <div className="flex flex-col gap-4">
                    <div className="mx-auto w-full max-w-sm rounded-md p-6">
                        <div className="mb-6 flex flex-col items-center">
                            <a href={logo.url} className="mb-6 flex items-center gap-2">
                                <Image src={logo.src} className="max-h-8" alt={logo.alt} width={32} height={32} />
                            </a>
                            <h1 className="mb-2 text-2xl font-bold">{heading}</h1>
                            <p className="text-muted-foreground">{subheading}</p>
                        </div>
                        <div>
                            <div className="grid gap-4">
                                <Button variant="outline" className="w-full cursor-pointer" onClick={handleSignIn}>
                                    <FcGoogle className="mr-2 size-5" />
                                    {googleText}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-center text-sm text-muted-foreground">
                    <p>© {currentYear} Spy Tech. Todos os direitos reservados.</p>
                </div>
            </div>
        </section>
    );
}
