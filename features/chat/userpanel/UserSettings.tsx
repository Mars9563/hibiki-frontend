'use client';

import { useState } from 'react';
import { AvatarImage } from '@/components/ui/avatar';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Avatar, AvatarFallback } from '@/components/ui/pixelact-ui/avatar';
import { Input } from '@/components/ui/pixelact-ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/pixelact-ui/dialog';
import { useUser } from '@/providers/user-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { createClient } from '@/lib/supabase/client';
 // adjust to your supabase client path

const registerSchema = z.object({
  name: z.string().trim().nonempty('Name is required').max(255),
  username: z
    .string()
    .trim()
    .regex(
      /^[_a-zA-Z][a-zA-Z0-9._]{2,19}$/,
      'Username must start with a letter or underscore and contain only letters, numbers, dots, or underscores (3–20 chars).'
    ),
});

export function UserSettings() {
  const { user, setUser } = useUser();
  const supabase = createClient();

  // Preview is only for inside the dialog — starts as null
  const [dialogPreviewUrl, setDialogPreviewUrl] = useState<string | null>(null);
  // The pending file to upload when user hits Save
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // The committed avatar URL (set after saving)
  const [committedAvatarUrl, setCommittedAvatarUrl] = useState<string | null>(
    user?.avatar_url ?? null
  );

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: user?.full_name,
      username: user?.username,
    },
  });

  // When dialog opens, reset preview to the current committed avatar
  function handleDialogOpen(open: boolean) {
    setDialogOpen(open);
    if (open) {
      setDialogPreviewUrl(committedAvatarUrl);
      setPendingFile(null);
      setUploadError(null);
    }
  }

  // File picked → show preview inside dialog only, store file for later upload
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File must be less than 2MB.');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Only JPG, PNG, WEBP allowed.');
      return;
    }

    // Show preview inside dialog only — don't touch the main avatar yet
    const localPreview = URL.createObjectURL(file);
    setDialogPreviewUrl(localPreview);
    setPendingFile(file);
  }

  // Save button inside dialog → upload to Cloudinary → update Supabase
  async function handleSave() {
    if (!pendingFile) {
      setDialogOpen(false);
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', pendingFile);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) throw new Error('Cloudinary upload failed.');

      const data = await response.json();
      const secureUrl: string = data.secure_url;

      // 2. Update Supabase and return updated row
      setIsSaving(true);

      const { data: updatedUser, error } = await supabase
        .from('profiles')
        .update({ avatar_url: secureUrl })
        .eq('id', user?.id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      // 3. Update React Context
      if (updatedUser) {
        setUser(updatedUser);
        setCommittedAvatarUrl(updatedUser.avatar_url);
      }

      // 4. Cleanup
      setPendingFile(null);
      setDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message ?? 'Something went wrong.');
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  }

  function onSubmit(values: z.infer<typeof registerSchema>) {
    // handle name/username update here
    console.log(values);
  }

  const loading = isUploading || isSaving;

  return (
    <div className="h-full w-full">
      <div className="flex flex-col justify-center items-start w-full p-4">
        <p className="font-ui text-4xl text-[#F3E8FF]">Update Details</p>
      </div>

      <div className="flex flex-col justify-center items-center p-4 gap-4">
        {/* Avatar triggers dialog */}
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
          <DialogTrigger asChild>
            <button className="cursor-pointer">
              <Avatar size="extralarge" variant="round">
                {/* Main view always shows the committed avatar */}
                <AvatarImage src={committedAvatarUrl || ''} />
                <AvatarFallback className="bg-[#000000]">
                  {user?.username?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DialogTrigger>

          <DialogContent className="bg-[#1a1a1e] text-white">
            <DialogHeader>
              <DialogTitle className="text-[#C4B5FD]">
                Upload Profile Picture
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center gap-6 mt-6 w-full">
              <Avatar size="extralarge" variant="round">
                <AvatarImage src={dialogPreviewUrl || ''} />
                <AvatarFallback className="bg-[#000000]">
                  {user?.username?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              {/* Upload Button */}
              <label className="cursor-pointer w-full">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="hidden"
                />
                <div className="w-full border border-[#2a2a2f] rounded-lg py-3 px-4 text-center bg-[#111114] hover:bg-[#1c1c21] transition-colors">
                  <span className="text-[#C4B5FD] font-ui">Choose Image</span>
                </div>
              </label>

              {uploadError && (
                <p className="text-sm text-red-500 text-center">
                  {uploadError}
                </p>
              )}

              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:opacity-90 disabled:opacity-50 text-white font-ui transition-all"
              >
                {loading
                  ? isUploading
                    ? 'Uploading...'
                    : 'Saving...'
                  : 'Save'}
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Form */}
        <div className="w-full">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="font-ui text-[#F3E8FF] text-2xl">
                      Name
                    </FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      className="bg-[#222327] text-[#555d63]"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="font-ui text-[#F3E8FF] text-2xl">
                      Username
                    </FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Username"
                      autoComplete="username"
                      className="bg-[#222327] text-[#555d63]"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
