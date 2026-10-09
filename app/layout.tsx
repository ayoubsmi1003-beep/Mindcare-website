import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MindCare Center | Dr. Larbi Nassiba - Psychiatre Mahelma, Alger',
  description: 'Cabinet spécialisé en psychiatrie et psychothérapie du Dr. Larbi Nassiba à Mahelma, Alger. Prise en charge personnalisée de l’anxiété, dépression, TDAH, traumatismes.',
  keywords: ['psychiatre mahelma', 'dr larbi nassiba', 'psychiatre alger', 'mindcare center', 'طبيب نفسي معالمة', 'عيادة نفسية الجزائر'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var origFetch = typeof window !== 'undefined' ? window.fetch : null;
                  var boundFetch = origFetch ? origFetch.bind(window) : null;
                  var currentFetch = boundFetch;

                  // Define both getter and setter on window so external scripts/extensions setting window.fetch will not throw
                  try {
                    Object.defineProperty(window, 'fetch', {
                      get: function() {
                        return currentFetch;
                      },
                      set: function(fn) {
                        currentFetch = fn;
                      },
                      configurable: true,
                      enumerable: true
                    });
                  } catch (_) {}

                  if (typeof Window !== 'undefined' && Window.prototype) {
                    try {
                      Object.defineProperty(Window.prototype, 'fetch', {
                        get: function() {
                          return currentFetch;
                        },
                        set: function(fn) {
                          currentFetch = fn;
                        },
                        configurable: true,
                        enumerable: true
                      });
                    } catch (_) {}
                  }
                } catch (_) {}

                if (typeof window !== 'undefined') {
                  window.addEventListener('error', function(event) {
                    if (!event) return;
                    var fn = event.filename || '';
                    var msg = event.message || '';
                    if (
                      fn.indexOf('chrome-extension://') !== -1 ||
                      fn.indexOf('moz-extension://') !== -1 ||
                      msg.indexOf('Cannot set property fetch') !== -1
                    ) {
                      event.preventDefault();
                      if (typeof event.stopImmediatePropagation === 'function') {
                        event.stopImmediatePropagation();
                      }
                    }
                  }, true);
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

