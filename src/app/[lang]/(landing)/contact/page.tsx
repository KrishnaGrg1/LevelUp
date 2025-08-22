'use client';

import React, { useState, useEffect } from 'react';

import LanguageStore from '@/stores/useLanguage';
import { validateLanguage } from '@/lib/language';
import { Mail, Phone, MapPin, Send, MessageCircle, Heart, Clock, CheckCircle } from 'lucide-react';
import { t } from '@/translations/index';
interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

const ContactPage: React.FC<ContactPageProps> = ({ params }) => {
  const { setLanguage } = LanguageStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general',
  });

  useEffect(() => {
    params.then(resolvedParams => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params, setLanguage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-32 text-center min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/15 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative mx-auto max-w-4xl px-6 z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/20 mb-8">
            <MessageCircle className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              {t('landing.contact.heroSection.badge')}
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              {t('landing.contact.heroSection.title1')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('landing.contact.heroSection.title2')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {t('landing.contact.heroSection.description')}
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {t('landing.contact.contactOptions.title')}
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {t('landing.contact.contactOptions.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Mail,
                title: 'landing.contact.contactOptions.email.title',
                description: 'landing.contact.contactOptions.email.desc',
                contact: 'hello@levelup.app',
                response: 'landing.contact.contactOptions.email.response',
                color: 'from-blue-500 to-indigo-500',
              },
              {
                icon: MessageCircle,
                title: 'landing.contact.contactOptions.chat.title',
                description: 'landing.contact.contactOptions.chat.desc',
                contact: 'landing.contact.contactOptions.chat.contact',
                response: 'landing.contact.contactOptions.chat.response',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: Phone,
                title: 'landing.contact.contactOptions.phone.title',
                description: 'landing.contact.contactOptions.phone.desc',
                contact: 'landing.contact.contactOptions.phone.contact',
                response: 'landing.contact.contactOptions.phone.response',
                color: 'from-purple-500 to-pink-500',
              },
            ].map((method, index) => (
              <div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-3xl border border-slate-700/30 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl mx-auto mb-6 flex items-center justify-center`}
                  >
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{t(method.title)}</h3>
                  <p className="text-slate-400 mb-4">{t(method.description)}</p>
                  <p className="text-purple-400 font-semibold mb-2">{t(method.contact)}</p>
                  <p className="text-slate-500 text-sm">{t(method.response)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative py-32 bg-gradient-to-b from-slate-900 to-black">
        <div className="relative mx-auto max-w-4xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {t('landing.contact.form.title')}
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {t('landing.contact.form.description')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-slate-300 font-medium mb-2">
                  {t('landing.contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  placeholder={t('landing.contact.form.placeholderName')}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-slate-300 font-medium mb-2">
                  {t('landing.contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  placeholder={t('landing.contact.form.placeholderEmail')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-slate-300 font-medium mb-2">
                  {t('landing.contact.form.type')}
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                >
                  <option value="general">{t('landing.contact.form.select.general')}</option>
                  <option value="support">{t('landing.contact.form.select.support')}</option>
                  <option value="billing">{t('landing.contact.form.select.billing')}</option>
                  <option value="enterprise">{t('landing.contact.form.select.enterprise')}</option>
                  <option value="partnership">
                    {t('landing.contact.form.select.partnership')}
                  </option>
                  <option value="feedback">{t('landing.contact.form.select.feedback')}</option>
                  <option value="other">{t('landing.contact.form.select.other')}</option>
                </select>
              </div>
              <div>
                <label htmlFor="subject" className="block text-slate-300 font-medium mb-2">
                  {t('landing.contact.form.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  placeholder={t('landing.contact.form.placeholderSubject')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-slate-300 font-medium mb-2">
                {t('landing.contact.form.message')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-vertical"
                placeholder={t('landing.contact.form.placeholderMessage')}
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                <Send className="w-5 h-5" />
                <span>{t('landing.contact.form.send')}</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Office Information */}
      <section className="relative py-32 bg-gradient-to-b from-black to-slate-950">
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              {t('landing.contact.office.title')}
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {t('landing.contact.office.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-start space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Pokhara Office</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Lakeside
                    <br />
                    Pokhara, Nepal 33700
                    <br />
                    <span className="text-slate-400">Nepal</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Office Hours</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Monday - Friday: 9:00 AM - 6:00 PM PST
                    <br />
                    Saturday: 10:00 AM - 4:00 PM PST
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">What to Expect</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {t('landing.contact.office.expectDetail')}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-slate-400">{t('landing.contact.office.map')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32 bg-gradient-to-b from-slate-950 to-black">
        <div className="relative mx-auto max-w-4xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('landing.contact.faq.title')}
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {t('landing.contact.faq.description')}
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: 'landing.contact.faq.items.0.q',
                answer: 'landing.contact.faq.items.0.a',
              },
              {
                question: 'landing.contact.faq.items.1.q',
                answer: 'landing.contact.faq.items.1.a',
              },
              {
                question: 'landing.contact.faq.items.2.q',
                answer: 'landing.contact.faq.items.2.a',
              },
              {
                question: 'landing.contact.faq.items.3.q',
                answer: 'landing.contact.faq.items.3.a',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-700/30 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{t(faq.question)}</h3>
                    <p className="text-slate-400 leading-relaxed">{t(faq.answer)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
