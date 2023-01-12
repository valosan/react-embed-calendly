# Embed Calendly widget in your React page.

Zero-dependency, functional TypeScript component to embed Calendly widget in the react app.

## Read more

https://help.calendly.com/hc/en-us/articles/223147027-Embed-options-overview

## Example

```tsx
<EmbedCalendly
  url="https://calendly.com/username/event?hide_event_type_details=1&hide_gdpr_banner=1"
  prefill={{
    name: name,
    email: email,
    customAnswers: {
      a1: "test1" /** Default values for custom questions **/
      a2: "test2"
    }
  }}
  onCalendlyEvent={event => {
    if (event.data.event.indexOf("calendly.event_scheduled") === 0) {
      calendlyScheduled();
    }
  }}
/>
```
                
