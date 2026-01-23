export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Select Agency",
      description: "Choose the government agency (DFA, LTO, BIR, etc.) you need help with."
    },
    {
      step: "02",
      title: "What do you need?",
      description: "Tell us your goal (e.g., 'Renew Passport', 'Get TIN') and your location."
    },
    {
      step: "03",
      title: "Get Simple Guide",
      description: "Receive a clear checklist, step-by-step process, and the nearest office address instantly."
    }
  ];

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-12 px-6 mx-auto max-w-screen-xl lg:py-18 lg:px-8">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold font-display text-emerald-900 dark:text-white">How It Works</h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">Skip the confusion. Get the right info in seconds.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((item, index) => (
            <div key={index} className="p-6 bg-white rounded-lg border border-emerald-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-xl">
                {item.step}
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
