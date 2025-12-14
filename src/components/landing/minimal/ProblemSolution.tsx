import { t } from '@/translations';
import LanguageStore from '@/stores/useLanguage';

export const ProblemSolution = () => {
  const { language } = LanguageStore();
  return (
    <section
      key={language}
      className="w-full py-20 bg-white dark:bg-black text-black dark:text-white border-t border-gray-100 dark:border-gray-900"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {/* Problem Side */}
          <div className="flex flex-col justify-center space-y-8 md:text-right md:items-end">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-semibold opacity-40">
                {t('landing.problemSolution.problem.title1')}
              </h3>
              <h3 className="text-2xl md:text-3xl font-semibold opacity-40">
                {t('landing.problemSolution.problem.title2')}
              </h3>
              <h3 className="text-2xl md:text-3xl font-semibold opacity-40">
                {t('landing.problemSolution.problem.title3')}
              </h3>
            </div>
          </div>

          {/* Solution Side */}
          <div className="flex flex-col justify-center space-y-8 md:items-start">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold">
                {t('landing.problemSolution.solution.title1')}
              </h3>
              <h3 className="text-2xl md:text-3xl font-bold">
                {t('landing.problemSolution.solution.title2')}
              </h3>
              <h3 className="text-2xl md:text-3xl font-semibold font-bold">
                {t('landing.problemSolution.solution.title3')}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
