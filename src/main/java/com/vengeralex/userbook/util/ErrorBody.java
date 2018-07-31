package com.vengeralex.userbook.util;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorBody {
    private final Integer code = 400;
    private String msg;
}
