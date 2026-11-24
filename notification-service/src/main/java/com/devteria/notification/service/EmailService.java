package com.devteria.notification.service;

import com.devteria.notification.dto.request.EmailRequest;
import com.devteria.notification.dto.response.EmailResponse;
import com.devteria.notification.repository.httpclient.EmailClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {
    EmailClient emailClient;

//    public EmailResponse sendEmail(EmailRequest emailRequest) {
//        return ;
//    }
}
