import publicConfig from "../public.config";

export class ContactEmail {
    messageEnd = "";
    template = {
        TEXT: "",
        HTML: "",
    };
    inputs = {
        name: "",
        familyName: "",
        email: "",
        message: "",
    };
    date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

    constructor(name: string, familyName: string, email: string, message: string) {
        this.inputs.name = name;
        this.inputs.familyName = familyName;
        this.inputs.email = email;
        this.inputs.message = message;

        this.messageEnd = `\n\nGeschrieben von ${this.inputs.name} ${this.inputs.familyName} am ${this.date}.\nDu kannst ${this.inputs.name} unter ${this.inputs.email} erreichen.`;

        this.template = {
            TEXT: `${publicConfig.TEMPLATES.EMAIL.TITLE}\n\n${this.inputs.message}\n\n${publicConfig.TEMPLATES.EMAIL.MESSAGE_END}\n\n${publicConfig.TEMPLATES.EMAIL.FOOTER}\n${publicConfig.TEMPLATES.EMAIL.FOOTER_2}`,
            HTML: `<div style="background:#f5f5f5">
  <div style="background-color:#f5f5f5;padding-top:80px">
    <div style="margin:0 auto;max-width:600px;background:#ffffff">
      <table cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;border-top:3px solid ${publicConfig.TEMPLATES.EMAIL.COLOR}" align="center" border="0">
        <tbody>
          <tr>
            <td style="text-align:center;vertical-align:top;font-size:0px;padding:40px 30px 30px 30px">
              <div style="vertical-align:top;display:inline-block;font-size:13px;text-align:left;width:100%">
                <table cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td style="word-break:break-word;font-size:0px;padding:0px;padding-bottom:30px" align="center">
                        <div style="color:#55575d;font-family:Open Sans,Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;line-height:22px">${publicConfig.TEMPLATES.EMAIL.TITLE}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="word-break:break-word;font-size:0px;padding:0px;padding-bottom:35px" align="center">
                        <div style="color:#8c8c8c;font-family:Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:22px">
                        </div>
                      </td>
                    </tr>                    
                    <tr>
                      <td style="word-break:break-word;font-size:0px;padding:0px" align="center">
                        <div style="font-family:Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:22px">
                          <p style="font-size:12px;line-height:18px;color:#8c8c8c;">
                            <big style="font:15px Arial,Helvetica,sans-serif;padding:10px;background:#ffffff;border:1px solid #e3e3e3;text-align:left;color:#555555;display:block;">
                              <b>${this.inputs.message.replace(/\n/g, "<br>")}</b>
                            </big>${publicConfig.TEMPLATES.EMAIL.MESSAGE_END}
                            <br>
                            ${this.messageEnd}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style="margin:0 auto;max-width:600px">
      <table cellpadding="0" cellspacing="0" style="font-size:0px;width:100%" align="center" border="0">
        <tbody>
          <tr>
            <td style="text-align:center;vertical-align:top;font-size:0px;padding:30px">
              <div style="vertical-align:top;display:inline-block;font-size:13px;text-align:left;width:100%">
                <table cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td style="word-break:break-word;font-size:0px;padding:0px;padding-bottom:10px" align="center">
                        <div style="color:#8c8c8c;font-family:Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:22px">
                          <span>${publicConfig.TEMPLATES.EMAIL.FOOTER}</span>
                          <span>${publicConfig.TEMPLATES.EMAIL.FOOTER_2}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="word-break:break-word;font-size:0px;padding:0px;padding-bottom:15px" align="center">
                        <div style="color:#8c8c8c;font-family:Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:22px">${publicConfig.COPYRIGHT}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="word-break:break-word;font-size:0px;padding:0px" align="center">
                        <div style="color:#8c8c8c;font-family:Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:22px">
                          <a href="${publicConfig.SOCIALS.ICONS["GitHub"].url}" style="text-decoration:none;color:inherit;padding:0 4px" target="_blank">
                            <img alt="${publicConfig.SOCIALS.ICONS["GitHub"].commonName}" title="${publicConfig.SOCIALS.ICONS["GitHub"].commonName}" src="${publicConfig.ORIGIN + publicConfig.TEMPLATES.EMAIL.URLS.GITHUB}" style="border:none;outline:none;text-decoration:none;height:28px;width:28px" width="28" height="28">
                          </a>
                          <a href="${publicConfig.SOCIALS.ICONS["LinkedIn"].url}" style="text-decoration:none;color:inherit;padding:0 4px" target="_blank">
                            <img alt="${publicConfig.SOCIALS.ICONS["LinkedIn"].commonName}" title="${publicConfig.SOCIALS.ICONS["LinkedIn"].commonName}" src="${publicConfig.ORIGIN + publicConfig.TEMPLATES.EMAIL.URLS.LINKEDIN}" style="border:none;outline:none;text-decoration:none;height:28px;width:28px" width="28" height="28">
                          </a>
                          <a href="${publicConfig.SOCIALS.ICONS["Instagram"].url}" style="text-decoration:none;color:inherit;padding:0 4px" target="_blank">
                            <img alt="${publicConfig.SOCIALS.ICONS["Instagram"].commonName}" title="${publicConfig.SOCIALS.ICONS["Instagram"].commonName}" src="${publicConfig.ORIGIN + publicConfig.TEMPLATES.EMAIL.URLS.INSTAGRAM}" style="border:none;outline:none;text-decoration:none;height:28px;width:28px" width="28" height="28">
                          </a>
                          <a href="${publicConfig.SOCIALS.ICONS["Website"].url}" style="text-decoration:none;color:inherit;padding:0 4px" target="_blank">
                            <img alt="${publicConfig.SOCIALS.ICONS["Website"].commonName}" title="${publicConfig.SOCIALS.ICONS["Website"].commonName}" src="${publicConfig.ORIGIN + publicConfig.TEMPLATES.EMAIL.URLS.WEBSITE}" style="border:none;outline:none;text-decoration:none;height:28px;width:28px" width="28" height="28">
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>`,
        };
    }
}
