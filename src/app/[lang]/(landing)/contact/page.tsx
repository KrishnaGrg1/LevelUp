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
    console.log('Form submitted:', formData);
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
      className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-300"
    >
      {/* Hero Section */}
      <section className="relative py-24 text-center">
        <div className="relative mx-auto max-w-4xl px-6 z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            {t('landing.contact.hero.title')}
          </h1>

          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t('landing.contact.hero.options')}
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="relative py-12">
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-3xl mx-auto">
            <div className="p-8 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 text-center">
              <h3 className="text-xl font-bold mb-2">{t('landing.contact.cards.support.title')}</h3>
              <p className="text-gray-500 mb-4">{t('landing.contact.cards.support.desc')}</p>
              <p className="text-sm font-medium">{t('landing.contact.cards.support.response')}</p>
            </div>
            <div className="p-8 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 text-center">
              <h3 className="text-xl font-bold mb-2">{t('landing.contact.cards.general.title')}</h3>
              <p className="text-gray-500 mb-4">{t('landing.contact.cards.general.desc')}</p>
              <p className="text-sm font-medium">{t('landing.contact.cards.general.response')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative pb-32">
        <div className="relative mx-auto max-w-3xl px-6 z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="text-sm font-medium mb-2">
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
                  className="h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:ring-black dark:focus:ring-white rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium mb-2">
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
                  className="h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:ring-black dark:focus:ring-white rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="inquiryType" className="text-sm font-medium mb-2">
                  {t('landing.contact.form.inquiryType')}
                </label>
                <Select onValueChange={handleSelectChange} defaultValue={formData.inquiryType}>
                  <SelectTrigger className="w-full h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:ring-black dark:focus:ring-white rounded-lg">
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
                <label htmlFor="subject" className="text-sm font-medium mb-2">
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
                  className="h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:ring-black dark:focus:ring-white rounded-lg"
                />
              </div>

              <div className=" md:col-span-2">
                <label htmlFor="message" className="text-sm font-medium mb-2">
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
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:ring-black dark:focus:ring-white resize-y rounded-lg"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <Button type="submit" size="lg" className="rounded-full px-12 h-12 ">
                {t('landing.contact.form.submit')}
              </Button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
              {t('landing.contact.form.footer')}
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
