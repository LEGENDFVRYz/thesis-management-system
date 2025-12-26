import RoleToggle from '@/components/role-toggle';
import { login as studentLogin } from '@/routes/student';
import InputError from '@/components/input-error';
import { TextLink } from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/faculty';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const [validationErrors, setValidationErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const email = (e.currentTarget.querySelector('#email') as HTMLInputElement)?.value || '';
        const password = (e.currentTarget.querySelector('#password') as HTMLInputElement)?.value || '';

        const errors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            errors.email = '* This is a required field';
        }
        if (!password.trim()) {
            errors.password = '* This is a required field';
        }

        if (Object.keys(errors).length > 0) {
            e.preventDefault();
            setValidationErrors(errors);
            return false;
        }

        setValidationErrors({});
    };

    return (
        <AuthLayout
            title="Sign In"
            description="Access your faculty thesis portal"
        >
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-[16px]"
                onSubmit={handleSubmit}
            >
                {({ processing, errors }) => (
                    <>
                        {/* Add Role Toggle */}
                        <RoleToggle
                            currentRole="faculty"
                            studentRoute={studentLogin()}
                            facultyRoute={store()}
                        />

                        <div className="flex flex-col items-center gap-[17px] self-stretch">
                            {errors.email && errors.email.includes('credentials') && (
                                <div className="w-full sm:w-[384px] text-center">
                                    <InputError message={errors.email} />
                                </div>
                            )}
                            <div className="flex flex-col gap-[8px] w-full sm:w-[384px]">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    className="auth-input"
                                    id="email"
                                    type="email"
                                    name="email"
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="Enter your email"
                                    style={validationErrors.email ? {
                                        borderColor: '#730000'
                                    } as React.CSSProperties : undefined}
                                />
                                {validationErrors.email && <InputError message={validationErrors.email} />}
                                {!validationErrors.email && errors.email && !errors.email.includes('credentials') && <InputError message={errors.email} />}
                            </div>

                            <div className="flex flex-col gap-[8px] w-full sm:w-[384px]">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    className="auth-input"
                                    id="password"
                                    type="password"
                                    name="password"
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    style={validationErrors.password ? {
                                        borderColor: '#730000'
                                    } as React.CSSProperties : undefined}
                                />
                                {validationErrors.password && <InputError message={validationErrors.password} />}
                                {!validationErrors.password && errors.password && <InputError message={errors.password} />}
                            </div>

                            <Button
                                type="submit"
                                variant="negative"
                                className="w-full sm:w-[384px] h-[36px] font-['DM_Sans'] font-medium text-[13.33px] text-justify rounded-[8px]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Sign In
                            </Button>
                        </div>

                        {canResetPassword && (
                            <TextLink
                                href={request()}
                                className="m-auto text-sm text-center text-[#730000] hover:underline"
                                tabIndex={5}
                            >
                                Forgot password?
                            </TextLink>
                        )}
                    </>
                )}
            </Form>

            {canRegister && (
                <div className="text-center text-sm text-muted-foreground mt-4">
                    Don't have an account?{' '}
                    <TextLink href={register()} className="text-[#730000] hover:underline" tabIndex={6}>
                        Sign up
                    </TextLink>
                </div>
            )}

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
