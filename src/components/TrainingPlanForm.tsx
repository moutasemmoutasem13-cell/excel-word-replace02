import { useState, useEffect } from 'react';
import { Calendar, Users, BookOpen, Clock, Send, Download, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { fetchGoogleSheetsData, submitFormToN8n } from '../services/api';
import type { GoogleSheetsData, FormData } from '../types';

const DAYS_OF_WEEK = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

export default function TrainingPlanForm() {
  const [sheetsData, setSheetsData] = useState<GoogleSheetsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    group: '',
    planType: '',
    planElement: '',
    day1: '',
    day2: '',
    startDay: 1,
    startMonth: 1,
    startYear: new Date().getFullYear(),
    planDuration: 1,
    requesterName: '',
  });

  useEffect(() => {
    loadSheetsData();
  }, []);

  const loadSheetsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGoogleSheetsData();
      setSheetsData(data);
    } catch (err) {
      setError('فشل تحميل البيانات من Google Sheets. تأكد من تكوين رابط Google Apps Script.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'planType') {
      setFormData(prev => ({
        ...prev,
        planElement: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.studentName.trim()) {
      setError('يرجى إدخال اسم الطالب');
      return false;
    }
    if (!formData.group) {
      setError('يرجى اختيار المجموعة');
      return false;
    }
    if (!formData.planType) {
      setError('يرجى اختيار نوع الخطة');
      return false;
    }
    if (!formData.planElement) {
      setError('يرجى اختيار عنصر الخطة');
      return false;
    }
    if (!formData.day1 || !formData.day2) {
      setError('يرجى اختيار يومي الدوام');
      return false;
    }
    if (formData.day1 === formData.day2) {
      setError('يجب أن يكون اليومان مختلفين');
      return false;
    }
    if (!formData.requesterName) {
      setError('يرجى اختيار اسم طالب الملف');
      return false;
    }
    if (formData.planDuration < 1 || formData.planDuration > 25) {
      setError('مدة الخطة يجب أن تكون بين 1 و 25 يوم');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setPdfUrl(null);

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await submitFormToN8n(formData);

      if (response.success && response.pdfUrl) {
        setPdfUrl(response.pdfUrl);
        setSuccess(true);
      } else {
        setError(response.error || 'حدث خطأ أثناء معالجة الطلب');
      }
    } catch (err) {
      setError('فشل إرسال البيانات. تأكد من تكوين رابط n8n Webhook.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      group: '',
      planType: '',
      planElement: '',
      day1: '',
      day2: '',
      startDay: 1,
      startMonth: 1,
      startYear: new Date().getFullYear(),
      planDuration: 1,
      requesterName: '',
    });
    setPdfUrl(null);
    setSuccess(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8" />
              <h1 className="text-3xl font-bold">نظام إدارة الخطط التدريبية</h1>
            </div>
            <p className="text-blue-100">قم بملء النموذج أدناه لتوليد خطة تدريبية بصيغة PDF</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  اسم الطالب
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="أدخل اسم الطالب"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Users className="w-4 h-4" />
                  المجموعة
                </label>
                <select
                  value={formData.group}
                  onChange={(e) => handleInputChange('group', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">اختر المجموعة</option>
                  {sheetsData?.groups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <BookOpen className="w-4 h-4" />
                  نوع الخطة
                </label>
                <select
                  value={formData.planType}
                  onChange={(e) => handleInputChange('planType', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">اختر نوع الخطة</option>
                  {sheetsData?.plans.map((plan) => (
                    <option key={plan} value={plan}>
                      {plan}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  عنصر الخطة
                </label>
                <select
                  value={formData.planElement}
                  onChange={(e) => handleInputChange('planElement', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={!formData.planType}
                  required
                >
                  <option value="">اختر عنصر الخطة</option>
                  {formData.planType &&
                    sheetsData?.planElements[formData.planType]?.map((element) => (
                      <option key={element} value={element}>
                        {element}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  اليوم الأول من الدوام
                </label>
                <select
                  value={formData.day1}
                  onChange={(e) => handleInputChange('day1', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">اختر اليوم</option>
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  اليوم الثاني من الدوام
                </label>
                <select
                  value={formData.day2}
                  onChange={(e) => handleInputChange('day2', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">اختر اليوم</option>
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  تاريخ البداية
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={formData.startDay}
                      onChange={(e) => handleInputChange('startDay', parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="اليوم"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={formData.startMonth}
                      onChange={(e) => handleInputChange('startMonth', parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="الشهر"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="2000"
                      max="2100"
                      value={formData.startYear}
                      onChange={(e) => handleInputChange('startYear', parseInt(e.target.value) || new Date().getFullYear())}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="السنة"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Clock className="w-4 h-4" />
                  مدة الخطة (بالأيام)
                </label>
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={formData.planDuration}
                  onChange={(e) => handleInputChange('planDuration', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  اسم طالب الملف
                </label>
                <select
                  value={formData.requesterName}
                  onChange={(e) => handleInputChange('requesterName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">اختر الاسم</option>
                  {sheetsData?.requesters.map((requester) => (
                    <option key={requester} value={requester}>
                      {requester}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && !pdfUrl && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p>تم إرسال الطلب بنجاح! جاري توليد ملف PDF...</p>
              </div>
            )}

            {pdfUrl && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <p>تم توليد ملف PDF بنجاح!</p>
                </div>
                <div className="flex gap-4">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    تحميل الملف
                  </a>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    نموذج جديد
                  </button>
                </div>
              </div>
            )}

            {!pdfUrl && (
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    إنشاء الخطة
                  </>
                )}
              </button>
            )}
          </form>
        </div>

        <div className="mt-6 text-center text-slate-600 text-sm">
          <p>نظام إدارة الخطط التدريبية - تم التطوير بواسطة فريق التطوير</p>
        </div>
      </div>
    </div>
  );
}
