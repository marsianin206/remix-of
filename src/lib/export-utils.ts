import { CanvasElement } from '@/components/builder/BuilderCanvas';

export function generateHTML(elements: CanvasElement[], projectName: string = 'my-website'): string {
  const renderElement = (html: string, props: Record<string, any>, styles: React.CSSProperties) => {
    let rendered = html;
    Object.entries(props).forEach(([key, value]) => {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value || ''));
    });
    
    // Add inline styles (only desktop styles)
    if (Object.keys(styles).length > 0) {
      const styleString = Object.entries(styles)
        .map(([key, value]) => {
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          return `${cssKey}: ${value}`;
        })
        .join('; ');
      
      // Try to add style to first element
      if (rendered.includes('<')) {
        const firstTagEnd = rendered.indexOf('>');
        const firstTag = rendered.substring(0, firstTagEnd);
        if (firstTag.includes('style=')) {
          rendered = rendered.replace(/style="([^"]*)"/, `style="$1; ${styleString}"`);
        } else {
          rendered = rendered.replace('>', ` style="${styleString}">`);
        }
      }
    }
    
    return rendered;
  };

  // Generate media queries for responsive styles
  const generateMediaQueries = () => {
    let mediaCSS = '';
    
    // Tablet styles (max-width: 768px)
    const tabletStyles = elements
      .filter(el => el.responsiveStyles?.tablet && Object.keys(el.responsiveStyles.tablet).length > 0)
      .map((el, index) => {
        const styles = Object.entries(el.responsiveStyles!.tablet!)
          .map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `    ${cssKey}: ${value};`;
          })
          .join('\n');
        return `  .element-${elements.indexOf(el)} {\n${styles}\n  }`;
      })
      .join('\n\n');
    
    if (tabletStyles) {
      mediaCSS += `\n/* Tablet Styles */\n@media (max-width: 768px) {\n${tabletStyles}\n}\n`;
    }
    
    // Mobile styles (max-width: 480px)
    const mobileStyles = elements
      .filter(el => el.responsiveStyles?.mobile && Object.keys(el.responsiveStyles.mobile).length > 0)
      .map((el, index) => {
        const styles = Object.entries(el.responsiveStyles!.mobile!)
          .map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `    ${cssKey}: ${value};`;
          })
          .join('\n');
        return `  .element-${elements.indexOf(el)} {\n${styles}\n  }`;
      })
      .join('\n\n');
    
    if (mobileStyles) {
      mediaCSS += `\n/* Mobile Styles */\n@media (max-width: 480px) {\n${mobileStyles}\n}\n`;
    }
    
    return mediaCSS;
  };

  const bodyContent = elements
    .map((element, index) => {
      const rendered = renderElement(element.html, element.props, element.styles);
      // Add class for CSS targeting
      return rendered.replace(/^<([a-zA-Z]+)/, `<$1 class="element-${index}"`);
    })
    .join('\n    ');

  const mediaQueries = generateMediaQueries();

  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        /* Header Styles */
        .header-classic, .header-cta, .header-transparent, .header-search, .header-centered {
            padding: 1rem 2rem;
            background: #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .header-classic .container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo, .logo-center {
            font-size: 1.5rem;
            font-weight: bold;
            color: #3b82f6;
        }
        
        nav, .nav-center {
            display: flex;
            gap: 2rem;
        }
        
        nav a, .nav-center a {
            text-decoration: none;
            color: #333;
            transition: color 0.3s;
        }
        
        nav a:hover, .nav-center a:hover {
            color: #3b82f6;
        }
        
        .cta-btn {
            background: #3b82f6;
            color: white;
            padding: 0.5rem 1.5rem;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 1rem;
        }
        
        .cta-btn:hover {
            background: #2563eb;
        }
        
        /* Hero Styles */
        .hero-simple, .hero-image, .hero-video, .hero-form, .hero-split {
            padding: 4rem 2rem;
            text-align: center;
            background: #f3f4f6;
        }
        
        .hero-simple h1, .hero-image h1, .hero-video h1, .hero-form h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #1f2937;
        }
        
        .hero-simple p, .hero-image p {
            font-size: 1.25rem;
            color: #6b7280;
            margin-bottom: 2rem;
        }
        
        .hero-simple button, .hero-form button {
            background: #3b82f6;
            color: white;
            padding: 0.75rem 2rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 1.1rem;
            cursor: pointer;
        }
        
        .hero-image {
            background-size: cover;
            background-position: center;
            color: white;
            min-height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .hero-split {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            align-items: center;
            text-align: left;
        }
        
        .hero-split img {
            width: 100%;
            border-radius: 0.5rem;
        }
        
        /* Features */
        .features-grid-3, .features-icons {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .feature, .feature-icon {
            text-align: center;
            padding: 2rem;
            border-radius: 0.5rem;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .feature h3, .feature-icon h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #1f2937;
        }
        
        .feature-icon {
            font-size: 3rem;
        }
        
        /* Pricing */
        .pricing-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .plan {
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            border: 2px solid #e5e7eb;
            text-align: center;
        }
        
        .plan.featured {
            border-color: #3b82f6;
            transform: scale(1.05);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .plan h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .price {
            font-size: 2.5rem;
            font-weight: bold;
            color: #3b82f6;
            margin: 1rem 0;
        }
        
        .plan button {
            background: #3b82f6;
            color: white;
            padding: 0.75rem 2rem;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            width: 100%;
            margin-top: 1rem;
        }
        
        /* Forms */
        .contact-form, .subscribe-form {
            max-width: 500px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .contact-form input,
        .contact-form textarea,
        .subscribe-form input {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 1rem;
        }
        
        .contact-form button,
        .subscribe-form button {
            width: 100%;
            background: #3b82f6;
            color: white;
            padding: 0.75rem;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 1rem;
        }
        
        /* Buttons */
        .btn-primary, .btn-icon {
            background: #3b82f6;
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 1rem;
        }
        
        .btn-primary:hover, .btn-icon:hover {
            background: #2563eb;
        }
        
        /* Cards */
        .card-simple, .card-image {
            background: white;
            padding: 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .card-image img {
            width: 100%;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
        }
        
        .card-simple h3, .card-image h3 {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
        }
        
        /* Gallery */
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            padding: 2rem;
        }
        
        .gallery-grid img {
            width: 100%;
            border-radius: 0.5rem;
            object-fit: cover;
        }
        
        /* Footer */
        .footer-simple, .footer-columns {
            background: #1f2937;
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        .footer-columns {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            text-align: left;
        }
        
        .footer-columns .col h4 {
            margin-bottom: 1rem;
        }
        
        /* CTA */
        .cta-banner {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
        }
        
        .cta-banner h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .cta-banner button {
            background: white;
            color: #667eea;
            padding: 1rem 2rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 1.1rem;
            cursor: pointer;
            margin-top: 1rem;
        }
        
        /* Stats */
        .stats-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
            padding: 3rem 2rem;
            background: #f9fafb;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat .number {
            font-size: 3rem;
            font-weight: bold;
            color: #3b82f6;
            display: block;
        }
        
        .stat p {
            color: #6b7280;
            margin-top: 0.5rem;
        }
        
        /* Testimonials */
        .testimonial-simple {
            max-width: 800px;
            margin: 0 auto;
            padding: 3rem 2rem;
            text-align: center;
        }
        
        .testimonial-simple blockquote {
            font-size: 1.5rem;
            font-style: italic;
            color: #4b5563;
            margin-bottom: 1rem;
        }
        
        .testimonial-simple .author {
            font-weight: bold;
            color: #1f2937;
        }
        
        /* Social Icons */
        .social-icons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            padding: 1rem;
        }
        
        .social-icons a {
            font-size: 2rem;
            text-decoration: none;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .features-grid-3,
            .features-icons,
            .pricing-3,
            .stats-4,
            .gallery-grid {
                grid-template-columns: 1fr;
            }
            
            .hero-split {
                grid-template-columns: 1fr;
            }
            
            .hero-simple h1, .hero-image h1 {
                font-size: 2rem;
            }
        }
        ${mediaQueries}
    </style>
</head>
<body>
    ${bodyContent}
</body>
</html>`;
}

export function generateCSS(elements: CanvasElement[]): string {
  let css = `/* Generated CSS */\n\n`;
  
  // Desktop/Base styles
  elements.forEach((element, index) => {
    if (Object.keys(element.styles).length > 0) {
      css += `.element-${index} {\n`;
      Object.entries(element.styles).forEach(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        css += `  ${cssKey}: ${value};\n`;
      });
      css += `}\n\n`;
    }
  });
  
  // Tablet styles
  const tabletElements = elements.filter(el => 
    el.responsiveStyles?.tablet && Object.keys(el.responsiveStyles.tablet).length > 0
  );
  
  if (tabletElements.length > 0) {
    css += `/* Tablet Styles (max-width: 768px) */\n@media (max-width: 768px) {\n`;
    tabletElements.forEach((element) => {
      const index = elements.indexOf(element);
      css += `  .element-${index} {\n`;
      Object.entries(element.responsiveStyles!.tablet!).forEach(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        css += `    ${cssKey}: ${value};\n`;
      });
      css += `  }\n\n`;
    });
    css += `}\n\n`;
  }
  
  // Mobile styles
  const mobileElements = elements.filter(el => 
    el.responsiveStyles?.mobile && Object.keys(el.responsiveStyles.mobile).length > 0
  );
  
  if (mobileElements.length > 0) {
    css += `/* Mobile Styles (max-width: 480px) */\n@media (max-width: 480px) {\n`;
    mobileElements.forEach((element) => {
      const index = elements.indexOf(element);
      css += `  .element-${index} {\n`;
      Object.entries(element.responsiveStyles!.mobile!).forEach(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        css += `    ${cssKey}: ${value};\n`;
      });
      css += `  }\n\n`;
    });
    css += `}\n\n`;
  }
  
  return css;
}

export function generateJSON(elements: CanvasElement[], projectName: string): string {
  return JSON.stringify({
    projectName,
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    elements: elements.map(el => ({
      id: el.id,
      componentId: el.componentId,
      props: el.props,
      styles: el.styles
    }))
  }, null, 2);
}

export function downloadFile(content: string, filename: string, type: string = 'text/html') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportProject(elements: CanvasElement[], projectName: string = 'my-website') {
  // Generate files
  const html = generateHTML(elements, projectName);
  const css = generateCSS(elements);
  const json = generateJSON(elements, projectName);
  
  // Download HTML
  downloadFile(html, `${projectName}.html`, 'text/html');
  
  // Download CSS if there are custom styles
  if (css.length > 50) {
    setTimeout(() => downloadFile(css, `${projectName}.css`, 'text/css'), 100);
  }
  
  // Download JSON project file
  setTimeout(() => downloadFile(json, `${projectName}.json`, 'application/json'), 200);
}

export function saveProject(elements: CanvasElement[], projectName: string) {
  const projectData = {
    projectName,
    elements,
    lastModified: new Date().toISOString()
  };
  
  localStorage.setItem(`webbuilder-${projectName}`, JSON.stringify(projectData));
  
  // Save to projects list
  const projectsList = JSON.parse(localStorage.getItem('webbuilder-projects') || '[]');
  if (!projectsList.includes(projectName)) {
    projectsList.push(projectName);
    localStorage.setItem('webbuilder-projects', JSON.stringify(projectsList));
  }
}

export function loadProject(projectName: string): CanvasElement[] | null {
  const data = localStorage.getItem(`webbuilder-${projectName}`);
  if (data) {
    const project = JSON.parse(data);
    return project.elements;
  }
  return null;
}

export function getProjectsList(): string[] {
  return JSON.parse(localStorage.getItem('webbuilder-projects') || '[]');
}