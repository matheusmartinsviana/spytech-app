import StepperForm from "@/components/common/stepper-form";
import { UserProfile } from "@/components/common/user-profile";
import { ensureCompanyProfileNotCompleted } from "@/lib/auth/ensure-company-profile";
import { getCurrentUserEmail } from "@/lib/get-current-email";

export default async function RegisterCompanyProfile() {
    const email = await getCurrentUserEmail();
    await ensureCompanyProfileNotCompleted();

    return (
        <div className="flex flex-col items-center justify-center w-full h-max-screen p-4 mx-auto space-y-6">
            <UserProfile />
            <StepperForm email={email} />
        </div>
    );
}
