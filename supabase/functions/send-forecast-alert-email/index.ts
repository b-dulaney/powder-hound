import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.5";
import { Database } from "../database-generated.types.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

interface Alert {
  url: string;
  user_id: string;
  mountain_id: number;
  display_name: string;
  snow_next_24h: number;
  threshold_inches: number;
}

interface UserAlert {
  email: string;
  alerts: Alert[];
}

const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

function buildAlertsTable(alerts: Alert[]): string {
  let html = "";
  alerts.forEach((alert) => {
    html += `
    <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#fcfcfc" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#fcfcfc;background-color:#fcfcfc;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fcfcfc;background-color:#fcfcfc;width:100%;">
        <tbody>
          <tr>
            <td style="border:none;direction:ltr;font-size:0px;padding:20px 0px 20px 0px;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;vertical-align:top;">
                <!--[if mso | IE]><table border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td style="vertical-align:top;width:300px;" ><![endif]-->
                <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:50%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                    <tbody>
                      <tr>
                        <td style="border:none;vertical-align:top;padding:0px 0px 0px 0px;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                            <tbody>
                              <tr>
                                <td align="center" style="font-size:0px;padding:10px 25px 10px 25px;word-break:break-word;">
                                  <div style="font-family:Open Sans,Roboto,Arial,sans-serif;font-size:18px;line-height:1.7;text-align:center;color:#1A1C26;"><a href="${alert.url}">${alert.display_name}</a></div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td><td style="vertical-align:top;width:300px;" ><![endif]-->
                <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:50%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                    <tbody>
                      <tr>
                        <td style="border:none;vertical-align:top;padding:0px 0px 0px 0px;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                            <tbody>
                              <tr>
                                <td align="center" style="font-size:0px;padding:10px 25px 10px 25px;word-break:break-word;">
                                  <div style="font-family:Open Sans,Roboto,Arial,sans-serif;font-size:18px;line-height:1.7;text-align:center;color:#1A1C26;">${alert.snow_next_24h}"<br></div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
        `;
  });
  return html;
}

/** Deno request handler */
Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization")!;
  if (authHeader !== `Bearer ${SERVICE_KEY}`) {
    return new Response(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const userAlerts = await req.json();

  userAlerts.forEach(async (user: UserAlert) => {
    const userAlertsHtml = buildAlertsTable(user.alerts);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "PowderHound <alerts@powderhound.io>",
        to: [user.email],
        subject: "PowderHound forecast alert",
        html: `<!doctype html>
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      
      <head>
        <title>
        </title>
        <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
          #outlook a {
            padding: 0;
          }
      
          body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
      
          table,
          td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
      
          img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
          }
      
          p {
            display: block;
            margin: 13px 0;
          }
        </style>
        <!--[if mso]>
          <noscript>
          <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
          </xml>
          </noscript>
          <![endif]-->
        <!--[if lte mso 11]>
          <style type="text/css">
            .mj-outlook-group-fix { width:100% !important; }
          </style>
          <![endif]-->
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,600" rel="stylesheet" type="text/css">
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" type="text/css">
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,600);
          @import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,700);
        </style>
        <!--<![endif]-->
        <style type="text/css">
          @media only screen and (min-width:480px) {
            .mj-column-per-100 {
              width: 100% !important;
              max-width: 100%;
            }
      
            .mj-column-per-50 {
              width: 50% !important;
              max-width: 50%;
            }
      
            .mj-column-per-60 {
              width: 60% !important;
              max-width: 60%;
            }
          }
        </style>
        <style media="screen and (min-width:480px)">
          .moz-text-html .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
          }
      
          .moz-text-html .mj-column-per-50 {
            width: 50% !important;
            max-width: 50%;
          }
      
          .moz-text-html .mj-column-per-60 {
            width: 60% !important;
            max-width: 60%;
          }
        </style>
        <style type="text/css">
          @media only screen and (max-width:480px) {
            table.mj-full-width-mobile {
              width: 100% !important;
            }
      
            td.mj-full-width-mobile {
              width: auto !important;
            }
          }
        </style>
        <style type="text/css">
        </style>
      </head>
      
      <body style="word-spacing:normal;background-color:#E1E8ED;">
        <div style="background-color:#E1E8ED;">
          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#fcfcfc" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
          <div style="background:#fcfcfc;background-color:#fcfcfc;margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fcfcfc;background-color:#fcfcfc;width:100%;">
              <tbody>
                <tr>
                  <td style="border:none;direction:ltr;font-size:0px;padding:20px 0px 0px 0px;text-align:center;">
                    <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                        <tbody>
                          <tr>
                            <td style="border:none;vertical-align:top;padding:0px 0px 0px 0px;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                <tbody>
                                  <tr>
                                    <td align="center" style="background:#fcfcfc;font-size:0px;padding:10px 25px 10px 25px;word-break:break-word;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                        <tbody>
                                          <tr>
                                            <td style="width:100px;">
                                              <img height="100" src="https://powderhound-static-images.s3.us-east-2.amazonaws.com/logo-128px.png" style="border:0;display:block;outline:none;text-decoration:none;height:100px;width:100%;font-size:13px;" width="100" />
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#fcfcfc" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
          <div style="background:#fcfcfc;background-color:#fcfcfc;margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fcfcfc;background-color:#fcfcfc;width:100%;">
              <tbody>
                <tr>
                  <td style="border:none;direction:ltr;font-size:0px;padding:20px 0px 0px 0px;text-align:center;">
                    <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                        <tbody>
                          <tr>
                            <td style="border:none;vertical-align:top;padding:0px 0px 0px 0px;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                <tbody>
                                  <tr>
                                    <td align="center" style="background:#fcfcfc;font-size:0px;padding:10px 25px 10px 25px;word-break:break-word;">
                                      <div style="font-family:Open Sans,Roboto,Arial,sans-serif;font-size:30px;font-weight:600;line-height:1.7;text-align:center;color:#1A1C26;">Powder Incoming<br></div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#fcfcfc" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
          <div style="background:#fcfcfc;background-color:#fcfcfc;margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fcfcfc;background-color:#fcfcfc;width:100%;">
              <tbody>
                <tr>
                  <td style="border:none;direction:ltr;font-size:0px;padding:20px 0px 0px 0px;text-align:center;">
                    <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                        <tbody>
                          <tr>
                            <td style="border:none;vertical-align:top;padding:0px 0px 0px 0px;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                <tbody>
                                  <tr>
                                    <td align="center" style="background:#fcfcfc;font-size:0px;padding:10px 25px 10px 25px;word-break:break-word;">
                                      <div style="font-family:Open Sans,Roboto,Arial,sans-serif;font-size:20px;font-weight:300;line-height:1.7;text-align:center;color:#1A1C26;">A forecast alert has been triggered for one or more of your favorite locations:<br></div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#fcfcfc" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
          <div style="background:#fcfcfc;background-color:#fcfcfc;margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fcfcfc;background-color:#fcfcfc;width:100%;">
              <tbody>
                <tr>
                  <td style="border:none;direction:ltr;font-size:0px;padding:20px 0px 20px 0px;text-align:center;">
                    <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;vertical-align:top;">
                      <!--[if mso | IE]><table border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td style="vertical-align:top;width:300px;" ><![endif]-->
                      <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:50%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                          <tbody>
                            <tr>
                              <td style="border:none;vertical-align:top;padding:0px 0px 0px 0px;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                  <tbody>
                                    <tr>
                                      <td align="center" style="font-size:0px;padding:10px 25px 10px 25px;word-break:break-word;">
                                        <div style="font-family:Open Sans,Roboto,Arial,sans-serif;font-size:18px;line-height:1.7;text-align:center;color:#1A1C26;">Location</div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <!--[if mso | IE]></td><td style="vertical-align:top;width:300px;" ><![endif]-->
                      <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:50%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                          <tbody>
                            <tr>
                              <td style="border:none;vertical-align:top;padding:0px 0px 0px 0px;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                  <tbody>
                                    <tr>
                                      <td align="center" style="font-size:0px;padding:10px 25px 10px 25px;word-break:break-word;">
                                        <div style="font-family:Open Sans,Roboto,Arial,sans-serif;font-size:18px;line-height:1.7;text-align:center;color:#1A1C26;">Next 24H<br></div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <!--[if mso | IE]></td></tr></table><![endif]-->
                    </div>
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          ${userAlertsHtml}
          <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
          <div style="margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
              <tbody>
                <tr>
                  <td style="direction:ltr;font-size:0px;padding:0px;text-align:left;">
                    <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                        <tbody>
                          <tr>
                            <td align="center" style="background:#fcfcfc;font-size:0px;padding:30px 25px 10px 25px;word-break:break-word;">
                              <div style="font-family:Open Sans,Roboto,Arial,sans-serif;font-size:14px;line-height:1.7;text-align:center;color:#1A1C26;">Looking for something else?<br></div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#fcfcfc" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
          <div style="background:#fcfcfc;background-color:#fcfcfc;margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fcfcfc;background-color:#fcfcfc;width:100%;">
              <tbody>
                <tr>
                  <td style="border:none;direction:ltr;font-size:0px;padding:20px 0px 20px 0px;text-align:center;">
                    <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:360px;" ><![endif]-->
                    <div class="mj-column-per-60 mj-outlook-group-fix" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;vertical-align:top;">
                      <!--[if mso | IE]><table border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td style="vertical-align:middle;width:180px;" ><![endif]-->
                      <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:50%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                          <tbody>
                            <tr>
                              <td style="border:none;vertical-align:middle;padding:0px 25px 0px 25px;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                  <tbody>
                                    <tr>
                                      <td align="center" style="font-size:0px;padding:10px 0px 10px 0px;word-break:break-word;">
                                        <div style="font-family:Open Sans,Roboto,Arial,sans-serif;font-size:14px;line-height:1.7;text-align:center;color:#1A1C26;"><a href="https://powderhound.io/conditions">View Conditions</a></div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <!--[if mso | IE]></td><td style="vertical-align:middle;width:180px;" ><![endif]-->
                      <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:50%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                          <tbody>
                            <tr>
                              <td style="border:none;vertical-align:middle;padding:0px 25px 0px 25px;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                  <tbody>
                                    <tr>
                                      <td align="center" style="font-size:0px;padding:10px 0px 10px 0px;word-break:break-word;">
                                        <div style="font-family:Open Sans,Roboto,Arial,sans-serif;font-size:14px;line-height:1.7;text-align:center;color:grey;"><a href="https://powderhound.io/alerts">Manage Alerts</a></div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <!--[if mso | IE]></td></tr></table><![endif]-->
                    </div>
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#fcfcfc" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
          <div style="background:#fcfcfc;background-color:#fcfcfc;margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fcfcfc;background-color:#fcfcfc;width:100%;">
              <tbody>
                <tr>
                  <td style="border:none;direction:ltr;font-size:0px;padding:20px 0px 20px 0px;text-align:center;">
                    <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                        <tbody>
                          <tr>
                            <td style="border:none;vertical-align:top;padding:0px 0px 0px 0px;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
                                <tbody>
                                  <tr>
                                    <td align="center" style="font-size:0px;padding:10px 25px 10px 25px;word-break:break-word;">
                                      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td><![endif]-->
                                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                                        <tbody>
                                          <tr>
                                            <td style="padding:4px 4px 4px 4px;vertical-align:middle;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:20px;">
                                                <tbody>
                                                  <tr>
                                                    <td style="padding:0px;font-size:0;height:20px;vertical-align:middle;width:20px;">
                                                      <a href="https://powderhound.io" target="_blank">
                                                        <img height="20" src="https://powderhound-static-images.s3.us-east-2.amazonaws.com/logo-128px.png" style="border-radius:3px;display:block;" width="20" />
                                                      </a>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                            <td style="vertical-align:middle;padding:4px 4px 4px 0px;">
                                              <a href="https://powderhound.io" style="color:#333333;font-size:13px;font-weight:normal;font-family:Open Sans,Roboto,Arial,sans-serif;line-height:22px;text-decoration:none;" target="_blank"> powderhound.io </a>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <!--[if mso | IE]></td></tr></table><![endif]-->
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!--[if mso | IE]></td></tr></table><![endif]-->
        </div>
      </body>
      
      </html>`,
      }),
    });

    const data = await res.json();
  });

  return new Response(
    JSON.stringify({ message: "Updates completed" }),
    { headers: { "Content-Type": "application/json" } },
  );
});
