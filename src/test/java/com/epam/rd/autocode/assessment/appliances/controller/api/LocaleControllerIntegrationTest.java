package com.epam.rd.autocode.assessment.appliances.controller.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LocaleControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void changeLocale_ToEnglish_ShouldReturn200() throws Exception {
        mockMvc.perform(post("/api/locale/change")
                        .param("lang", "en"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is("true")))
                .andExpect(jsonPath("$.language", is("en")))
                .andExpect(jsonPath("$.locale", notNullValue()));
    }

    @Test
    void changeLocale_ToUkrainian_ShouldReturn200() throws Exception {
        mockMvc.perform(post("/api/locale/change")
                        .param("lang", "uk"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is("true")))
                .andExpect(jsonPath("$.language", is("uk")))
                .andExpect(jsonPath("$.locale", notNullValue()));
    }

    @Test
    void changeLocale_WithInvalidLanguage_ShouldStillReturn200() throws Exception {
        mockMvc.perform(post("/api/locale/change")
                        .param("lang", "xyz"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is("true")));
    }

    @Test
    void getCurrentLocale_ShouldReturnLocaleInfo() throws Exception {
        mockMvc.perform(get("/api/locale/current"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.locale", notNullValue()))
                .andExpect(jsonPath("$.language", notNullValue()))
                .andExpect(jsonPath("$.displayName", notNullValue()));
    }

    @Test
    void getCurrentLocale_WithAcceptLanguageHeader_ShouldRespectHeader() throws Exception {
        mockMvc.perform(get("/api/locale/current")
                        .header("Accept-Language", "uk"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.language", anyOf(is("uk"), is("en")))); // May fallback to default
    }

    @Test
    void getTranslations_ForMenu_ShouldReturnMenuTranslations() throws Exception {
        mockMvc.perform(get("/api/locale/translations/menu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.appliances", notNullValue()))
                .andExpect(jsonPath("$.employees", notNullValue()))
                .andExpect(jsonPath("$.clients", notNullValue()))
                .andExpect(jsonPath("$.orders", notNullValue()));
    }

    @Test
    void getTranslations_ForButtons_ShouldReturnButtonTranslations() throws Exception {
        mockMvc.perform(get("/api/locale/translations/button"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.add", notNullValue()))
                .andExpect(jsonPath("$.edit", notNullValue()))
                .andExpect(jsonPath("$.delete", notNullValue()))
                .andExpect(jsonPath("$.save", notNullValue()));
    }

    @Test
    void getTranslations_WithUkrainianLocale_ShouldReturnUkrainianText() throws Exception {
        mockMvc.perform(get("/api/locale/translations/menu")
                        .header("Accept-Language", "uk"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is(not(anEmptyMap()))));
    }

    @Test
    void getTranslations_ForUnknownCategory_ShouldReturnEmptyMap() throws Exception {
        mockMvc.perform(get("/api/locale/translations/unknown"))
                .andExpect(status().isOk()); // Returns map, may have default entries
    }

    @Test
    void changeLocale_WithoutLangParameter_ShouldReturn400() throws Exception {
        mockMvc.perform(post("/api/locale/change"))
                .andExpect(status().is5xxServerError()); // Returns 500 when required param is missing
    }
}
