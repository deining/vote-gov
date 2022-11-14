/// <reference types="Cypress" />

const allPages = require("../../fixtures/spanish-site.json");

const excludedlinks = [
  'https://voterregistration.ct.gov/OLVR/welcome.do?ref=voteusa_es',
  'https://voterservices.elections.maryland.gov/OnlineVoterRegistration/InstructionsStep1?ref=voteusa_es',
  'https://www.sec.state.ma.us/ovr/?ref=voteusa_es',
  'https://olvr.ohiosos.gov/?ref=voteusa_es',
  'https://voterlookup.ohiosos.gov/voterlookup.aspx?ref=voteusa_es',
  'https://olvr.hawaii.gov/?ref=voteusa_es',
  'https://elections.hawaii.gov/voters/registration/?ref=voteusa_es',
  'https://vote.sos.ri.gov/Home/RegistertoVote?ref=voteusa_es',
  'https://vote.sos.ri.gov/VoterSpanish/RegisterToVote?ref=voteusa_es',
  'https://vote.sos.ri.gov/HomeSpanish/UpdateVoterRecord?ActiveFlag=0&?ref=voteusa_es'
];

describe("External Link Validator Test", () => {
  const baseURL = Cypress.env("base_url")
    ? Cypress.env("base_url")
    : "http://localhost:1313";

  const singlePage =
    Cypress.env("name") && Cypress.env("route")
      ? [
          {
            name: Cypress.env("name"),
            route: Cypress.env("route"),
          },
        ]
      : null;
  const pages = singlePage !== null ? singlePage : allPages;
  pages.forEach((page) => {
    it(
      `${page.name === "" ? "home" : page.name}`,
      () =>
        Cypress.env("retries") === true
          ? {
              retries: {
                runMode: 2,
              },
            }
          : {},
      () => {
        cy.visit({
          url: baseURL + page.route,
        });
        cy.get("div[role='main'] a[href^='https://']").each(link => {
          if (excludedlinks.indexOf(link.prop('href')) == -1) {
            cy.request({
              url: link.prop('href'),
              failOnStatusCode: false
            }).then((response) => {
              expect(response.status).to.oneOf([200])
            })
          }
        })
      }
    );
  });
});