'use client';
import React, { useState } from 'react';
import LanguageStore from '@/stores/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { t } from '@/translations';

const ContactPage = () => {
  const { language } = LanguageStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire this form to a backend endpoint.
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      inquiryType: value,
    }));
  };

  return (
    <div
      key={language}
      className="bg-white text-black transition-colors duration-300 dark:bg-black dark:text-white"
    >
      {/* Hero Section */}
      <section className="relative py-24 text-center">
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <h1 className="mb-6 text-5xl leading-tight font-bold tracking-tight md:text-7xl">
            {t('landing.contact.hero.title')}
          </h1>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-500 dark:text-gray-400">
            {t('landing.contact.hero.options')}
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="relative py-12">
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-black">
              <h3 className="mb-2 text-xl font-bold">{t('landing.contact.cards.support.title')}</h3>
              <p className="mb-4 text-gray-500">{t('landing.contact.cards.support.desc')}</p>
              <p className="text-sm font-medium">{t('landing.contact.cards.support.response')}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-black">
              <h3 className="mb-2 text-xl font-bold">{t('landing.contact.cards.general.title')}</h3>
              <p className="mb-4 text-gray-500">{t('landing.contact.cards.general.desc')}</p>
              <p className="text-sm font-medium">{t('landing.contact.cards.general.response')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative pb-32">
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 text-sm font-medium">
                  {t('landing.contact.form.name')} *
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={t('landing.contact.form.name')}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:focus:ring-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 text-sm font-medium">
                  {t('landing.contact.form.email')} *
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t('landing.contact.form.email')}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:focus:ring-white"
                />
              </div>

              <div>
                <label htmlFor="inquiryType" className="mb-2 text-sm font-medium">
                  {t('landing.contact.form.inquiryType')}
                </label>
                <Select onValueChange={handleSelectChange} defaultValue={formData.inquiryType}>
                  <SelectTrigger className="h-12 w-full rounded-lg border-gray-200 bg-gray-50 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:focus:ring-white">
                    <SelectValue placeholder={t('landing.contact.form.inquiryOptions.general')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">
                      {t('landing.contact.form.inquiryOptions.general')}
                    </SelectItem>
                    <SelectItem value="support">
                      {t('landing.contact.form.inquiryOptions.support')}
                    </SelectItem>
                    <SelectItem value="feedback">
                      {t('landing.contact.form.inquiryOptions.feedback')}
                    </SelectItem>
                    <SelectItem value="partnership">
                      {t('landing.contact.form.inquiryOptions.partnership')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 text-sm font-medium">
                  {t('landing.contact.form.subject')} *
                </label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder={t('landing.contact.form.subject')}
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:focus:ring-white"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="message" className="mb-2 text-sm font-medium">
                  {t('landing.contact.form.message')} *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder={t('landing.contact.form.message')}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="resize-y rounded-lg border-gray-200 bg-gray-50 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:focus:ring-white"
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button type="submit" size="lg" className="h-12 rounded-full px-12">
                {t('landing.contact.form.submit')}
              </Button>
            </div>
            <p className="mt-4 text-center text-xs text-gray-400">
              {t('landing.contact.form.footer')}
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
