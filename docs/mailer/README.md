# Sending Emails
Sending emails with Boring is done via the Mailer. You can use the core Mailer or extend it to create your own custom functionality. Contents of emails are built as Views in the `mailers` folder under the `views` folder.

## Sending Emails with basic Mailer
Later on we'll learn how to create custom Mailers to isolate logic, similar to Controllers, but the simplest way to send emails is via Boring.Mailer. Out of the box, the project is configured to use [maildev](https://github.com/djfarrelly/MailDev) for sending emails in a development-only style. If you inspect the `config` json you'll notice a configuration section for mailer:
```javascript
mailer: {
  plugin: "smtp",
  transport: {
    host: "localhost",
    port: 25,
    ignoreTLS: true
  }
}
```
Later on we'll learn how to include additional plugins for sending emails in production, etc.

To create a new email by hand, simply create a new file such as `welcome.html.ejs` under the `views/mailers` folder in your application like so:
```html
<h1>Hi buddy!</h1>
```

Then, to send an email, in a Controller for example, simply call the `deliverNow` function in `Boring.Mailer` like so:
```javascript
await Mailer.deliverNow('welcome', null, {
  from: "noreply@boringframework.org",
  to: "fake@example.com",
  subject: "Welcome!",
});
```
You can also choose to deliver your messages asynchronously during the `nextTick` by calling the `deliverLater` method:
```javascript
Mailer.deliverLater('welcome', null, {
  from: "noreply@boringframework.org",
  to: "fake@example.com",
  subject: "Welcome! (on a delay)",
});
```

## Creating Custom Mailers
Currently, creating custom mailers is not supported by the CLI. To do that you'd need to create the code by hand which is not recommended as that could be broken in a future release.
