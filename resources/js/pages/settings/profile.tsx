import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

type ProfileUser = {
    id: number;
    role: 'student' | 'faculty' | 'admin';
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    suffix?: string | null;
    email: string;
    email_verified_at?: string | null;
};

type Faculty = {
    id: number;
    name: string;
    email: string;
};

type PageProps = {
    user: ProfileUser;
    facultyList: Faculty[];
    isAdmin: boolean;
    mustVerifyEmail: boolean;
    status?: string;
};

export default function Profile() {
    const { user, facultyList, isAdmin, mustVerifyEmail, status } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                {/* First Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="first_name">First name</Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        defaultValue={user.first_name}
                                        required
                                    />
                                    <InputError message={errors.first_name} />
                                </div>

                                {/* Middle Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="middle_name">Middle name</Label>
                                    <Input
                                        id="middle_name"
                                        name="middle_name"
                                        defaultValue={user.middle_name ?? ''}
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="last_name">Last name</Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        defaultValue={user.last_name}
                                        required
                                    />
                                    <InputError message={errors.last_name} />
                                </div>

                                {/* Suffix */}
                                <div className="grid gap-2">
                                    <Label htmlFor="suffix">Suffix</Label>
                                    <Input
                                        id="suffix"
                                        name="suffix"
                                        defaultValue={user.suffix ?? ''}
                                    />
                                </div>

                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue={user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Email verification notice */}
                                {mustVerifyEmail && user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to resend the verification email.
                                            </Link>
                                        </p>

                                        {status === 'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                A new verification link has been sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-4">
                                    <Button disabled={processing} data-test="update-profile-button">
                                        Save
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">Saved</p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>

                    {/* Transfer Admin Role - Only for Admin Users */}
                    {isAdmin && (
                        <div className="mt-8 p-4 border rounded-lg bg-white dark:bg-gray-800">
                            <HeadingSmall
                                title="Transfer Admin Role"
                                description="Assign admin privileges to another faculty member"
                            />

                            <Form
                                method="post"
                                action="/settings/profile/transfer-admin"
                                className="space-y-4 mt-4"
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="faculty_id">Select Faculty</Label>
                                    <select
                                        id="faculty_id"
                                        name="faculty_id"
                                        className="border rounded p-2"
                                        required
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            -- Select Faculty --
                                        </option>
                                        {facultyList.map((f: Faculty) => (
                                            <option key={f.id} value={f.id}>
                                                {f.name} ({f.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="revoke_self"
                                        name="revoke_self"
                                        value="1"  // Add this
                                        className="w-4 h-4"
                                    />
                                    <Label htmlFor="revoke_self">
                                        Revoke my admin privileges after transfer
                                    </Label>
                                </div>

                                <Button type="submit">Transfer Admin</Button>
                            </Form>
                        </div>
                    )}
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}