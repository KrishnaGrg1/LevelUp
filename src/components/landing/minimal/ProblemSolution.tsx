import { t } from '@/translations';
import LanguageStore from '@/stores/useLanguage';

export const ProblemSolution = () => {
  const { language } = LanguageStore();
  return (
    <section
      key={language}
      className="w-full border-t border-gray-100 bg-white py-20 text-black dark:border-gray-900 dark:bg-black dark:text-white"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-24">
          {/* Problem Side */}
          <div className="flex flex-col justify-center space-y-8 md:items-end md:text-right">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold opacity-40 md:text-3xl">
                {t('landing.problemSolution.problem.title1')}
              </h3>
              <h3 className="text-2xl font-semibold opacity-40 md:text-3xl">
                {t('landing.problemSolution.problem.title2')}
              </h3>
              <h3 className="text-2xl font-semibold opacity-40 md:text-3xl">
                {t('landing.problemSolution.problem.title3')}
              </h3>
            </div>
          </div>

          {/* Solution Side */}
          <div className="flex flex-col justify-center space-y-8 md:items-start">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold md:text-3xl">
                {t('landing.problemSolution.solution.title1')}
              </h3>
              <h3 className="text-2xl font-bold md:text-3xl">
                {t('landing.problemSolution.solution.title2')}
              </h3>
              <h3 className="text-2xl font-bold font-semibold md:text-3xl">
                {t('landing.problemSolution.solution.title3')}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
