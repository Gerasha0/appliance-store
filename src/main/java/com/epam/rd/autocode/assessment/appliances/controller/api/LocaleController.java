package com.epam.rd.autocode.assessment.appliances.controller.api;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.LocaleResolver;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/locale")
@RequiredArgsConstructor
public class LocaleController {

    private final MessageSource messageSource;
    private final LocaleResolver localeResolver;

    @PostMapping("/change")
    public ResponseEntity<Map<String, String>> changeLocale(
            @RequestParam String lang,
            HttpServletRequest request) {
        
        Locale locale = Locale.forLanguageTag(lang);
        localeResolver.setLocale(request, null, locale);
        
        Map<String, String> response = new HashMap<>();
        response.put("success", "true");
        response.put("locale", locale.toString());
        response.put("language", locale.getLanguage());
        response.put("message", messageSource.getMessage("message.success", null, locale));
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/current")
    public ResponseEntity<Map<String, String>> getCurrentLocale(Locale locale) {
        Map<String, String> response = new HashMap<>();
        response.put("locale", locale.toString());
        response.put("language", locale.getLanguage());
        response.put("displayName", locale.getDisplayName(locale));
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/translations/{category}")
    public ResponseEntity<Map<String, String>> getTranslations(
            @PathVariable String category,
            Locale locale) {
        
        Map<String, String> translations = new HashMap<>();
        
        switch (category.toLowerCase()) {
            case "menu":
                translations.put("appliances", messageSource.getMessage("menu.appliances", null, locale));
                translations.put("employees", messageSource.getMessage("menu.employees", null, locale));
                translations.put("clients", messageSource.getMessage("menu.clients", null, locale));
                translations.put("orders", messageSource.getMessage("menu.orders", null, locale));
                translations.put("manufacturers", messageSource.getMessage("menu.manufacturers", null, locale));
                translations.put("logout", messageSource.getMessage("menu.logout", null, locale));
                break;
                
            case "button":
                translations.put("add", messageSource.getMessage("button.add", null, locale));
                translations.put("edit", messageSource.getMessage("button.edit", null, locale));
                translations.put("delete", messageSource.getMessage("button.delete", null, locale));
                translations.put("save", messageSource.getMessage("button.save", null, locale));
                translations.put("cancel", messageSource.getMessage("button.cancel", null, locale));
                translations.put("approve", messageSource.getMessage("button.approve", null, locale));
                translations.put("search", messageSource.getMessage("button.search", null, locale));
                translations.put("back", messageSource.getMessage("button.back", null, locale));
                break;
                
            case "appliance":
                translations.put("name", messageSource.getMessage("appliance.name", null, locale));
                translations.put("category", messageSource.getMessage("appliance.category", null, locale));
                translations.put("model", messageSource.getMessage("appliance.model", null, locale));
                translations.put("manufacturer", messageSource.getMessage("appliance.manufacturer", null, locale));
                translations.put("powerType", messageSource.getMessage("appliance.powerType", null, locale));
                translations.put("characteristic", messageSource.getMessage("appliance.characteristic", null, locale));
                translations.put("description", messageSource.getMessage("appliance.description", null, locale));
                translations.put("power", messageSource.getMessage("appliance.power", null, locale));
                translations.put("price", messageSource.getMessage("appliance.price", null, locale));
                break;
                
            case "order":
                translations.put("id", messageSource.getMessage("order.id", null, locale));
                translations.put("client", messageSource.getMessage("order.client", null, locale));
                translations.put("employee", messageSource.getMessage("order.employee", null, locale));
                translations.put("approved", messageSource.getMessage("order.approved", null, locale));
                translations.put("items", messageSource.getMessage("order.items", null, locale));
                translations.put("total", messageSource.getMessage("order.total", null, locale));
                break;
                
            default:
                translations.put("error", "Unknown category");
        }
        
        return ResponseEntity.ok(translations);
    }

    @GetMapping("/languages")
    public ResponseEntity<Map<String, Object>> getSupportedLanguages(Locale locale) {
        Map<String, Object> response = new HashMap<>();
        
        Map<String, String> languages = new HashMap<>();
        languages.put("en", messageSource.getMessage("language.english", null, locale));
        languages.put("uk", messageSource.getMessage("language.ukrainian", null, locale));
        
        response.put("languages", languages);
        response.put("current", locale.getLanguage());
        
        return ResponseEntity.ok(response);
    }
}