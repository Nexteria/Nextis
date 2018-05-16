<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages.
    |
    */

    'accepted' => 'Položka musí byť akceptovaná.',
    'active_url' => 'Položka má neplatnú URL adresu.',
    'after' => 'Položka musí byť dátum po :date.',
    'after_or_equal' => 'Položka musí byť dátum po alebo presne :date.',
    'alpha' => 'Položka môže obsahovať len písmená.',
    'alpha_dash' => 'Položka môže obsahovať len písmená, čísla a pomlčky.',
    'alpha_num' => 'Položka môže obsahovať len písmená, čísla.',
    'array' => 'Položka musí byť pole.',
    'before' => 'Položka musí byť dátum pred :date.',
    'before_or_equal' => 'Položka musí byť dátum pred alebo presne :date.',
    'between' => [
        'numeric' => 'Položka musí mať rozsah :min - :max.',
        'file' => 'Položka musí mať rozsah :min - :max kilobajtov.',
        'string' => 'Položka musí mať rozsah :min - :max znakov.',
        'array' => 'Položka musí mať rozsah :min - :max prvkov.',
    ],
    'boolean' => 'Položka musí byť True alebo False.',
    'confirmed' => 'Potvrdenie nie je zhodná.',
    'date' => 'Položka má neplatný dátum.',
    'date_format' => 'Položka sa nezhoduje s formátom :format.',
    'different' => 'Položka a :other musia byť odlišné.',
    'digits' => 'Položka musí mať :digits číslic.',
    'digits_between' => 'Položka musí mať rozsah :min až :max číslic.',
    'dimensions' => 'Položka má neplatné rozmery obrázku.',
    'distinct' => 'Položka je duplicitná.',
    'email' => 'Položka musí mať platný emailoví formát.',
    'phone' => 'Položka nie je v správnom telefónnom formáte (+421 XXX XXX XXX).',
    'exists' => 'Položka neexistuje.',
    'file' => 'Položka musí byť súbor.',
    'filled' => 'Položka je požadovaná.',
    'gt' => [
        'numeric' => 'Položka musí byť väčšia ako :value.',
        'file' => 'Položka musí byť väčšia ako :value kilobytes.',
        'string' => 'Položka musí byť dlhšia ako :value znakov.',
        'array' => 'Položka musí obsahovať viac ako :value vecí.',
    ],
    'gte' => [
        'numeric' => 'Položka musí byť väčšia alebo rovná :value.',
        'file' => 'Položka musí byť väčšia alebo rovná :value kilobytes.',
        'string' => 'Položka musí byť aspoň :value znakov dlhá.',
        'array' => 'Položka musí mať aspoň :value vecí.',
    ],
    'image' => 'Položka musí byť obrázok.',
    'in' => 'Položka sa nenachádza v povolených hodnotách.',
    'in_array' => 'Položka sa nenachádza v :other.',
    'integer' => 'Položka musí byť celé číslo.',
    'ip' => 'Položka musí byť platná IP adresa.',
    'ipv4' => 'Položka musí byť platná IPv4 adresa.',
    'ipv6' => 'Položka musí byť platná IPv6 adresa.',
    'json' => 'Položka musí byť platný JSON reťazec.',
    'lt' => [
        'numeric' => 'Položka must be less than :value.',
        'file' => 'Položka must be less than :value kilobytes.',
        'string' => 'Položka must be less than :value characters.',
        'array' => 'Položka must have less than :value items.',
    ],
    'lte' => [
        'numeric' => 'Položka must be less than or equal :value.',
        'file' => 'Položka must be less than or equal :value kilobytes.',
        'string' => 'Položka must be less than or equal :value characters.',
        'array' => 'Položka must not have more than :value items.',
    ],
    'max' => [
        'numeric' => 'Položka nemôže byť väčší ako :max.',
        'file' => 'Položka nemôže byť väčší ako :max kilobajtov.',
        'string' => 'Položka nemôže byť väčší ako :max znakov.',
        'array' => 'Položka nemôže mať viac ako :max prvkov.',
    ],
    'mimes' => 'Položka musí byť súbor s koncovkou: :values.',
    'mimetypes' => 'Položka musí byť súbor s koncovkou: :values.',
    'min' => [
        'numeric' => 'Položka musí mať aspoň :min.',
        'file' => 'Položka musí mať aspoň :min kilobajtov.',
        'string' => 'Položka musí mať aspoň :min znakov.',
        'array' => 'Položka musí mať aspoň :min prvkov.',
    ],
    'not_in' => 'Položka je neplatná.',
    'not_regex' => 'Položka format je neplatná.',
    'numeric' => 'Položka musí byť číslo.',
    'present' => 'Položka musí byť odoslaný.',
    'regex' => 'Položka má neplatný formát.',
    'required' => 'Položka je povinná.',
    'required_if' => 'Položka je povinná keď :other je :value.',
    'required_unless' => 'Položka je povinná, okrem prípadu keď :other je v :values.',
    'required_with' => 'Položka je povinná keď :values je prítomná.',
    'required_with_all' => 'Položka je povinná ak :values je nastavená.',
    'required_without' => 'Položka je povinná keď :values nie je prítomná.',
    'required_without_all' => 'Položka je povinná ak žiadne z :values nie je nastavená.',
    'same' => 'Položka a :other sa musia zhodovať.',
    'size' => [
        'numeric' => 'Položka musí byť :size.',
        'file' => 'Položka musí mať :size kilobajtov.',
        'string' => 'Položka musí mať :size znakov.',
        'array' => 'Položka musí obsahovať :size prvkov.',
    ],
    'string' => 'Položka musí byť reťazec znakov.',
    'timezone' => 'Položka musí byť platné časové pásmo.',
    'unique' => 'Položka už existuje.',
    'uploaded' => 'Nepodarilo sa nahrať Položka.',
    'url' => 'Položka musí mať formát URL.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap attribute place-holders
    | with something more reader friendly such as E-Mail Address instead
    | of "email". This simply helps us make messages a little cleaner.
    |
    */

    'attributes' => [
    ],
];
