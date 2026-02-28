import { type ChangeEvent, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import type { Customer } from '../../../entities/customer/model/types'
import type { Delivery } from '../../../entities/delivery/model/types'
import type { PaymentDraft } from '../../../processes/checkout/model/checkout.slice'
import { getCardBrand } from '../../lib/cardBrand'
import { sanitizeByField } from '../../lib/formSanitizers'
import { paymentDeliverySchema, type PaymentDeliveryFormValues } from '../../lib/paymentDeliverySchema'
import { Alert } from '../atoms/Alert'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { FormField } from '../molecules/FormField'
import { Badge } from '../ui/badge'

export type PaymentDeliveryPayload = {
  customer: Customer
  delivery: Delivery
  paymentDraft: PaymentDraft
}

type PaymentDeliveryFormProps = Readonly<{
  onSubmit: (payload: PaymentDeliveryPayload) => void
  submitLabel: string
}>

const defaultValues: PaymentDeliveryFormValues = {
  fullName: '',
  email: '',
  phone: '',
  documentType: 'CC',
  documentNumber: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  region: '',
  country: 'CO',
  postalCode: '',
  instructions: '',
  cardNumber: '',
  cvc: '',
  expMonth: '',
  expYear: '',
  cardHolder: '',
  installments: 1,
}

const autofillValues: PaymentDeliveryFormValues = {
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  phone: '3001112233',
  documentType: 'CC',
  documentNumber: '12345678',
  addressLine1: 'Street 1 #2-3',
  addressLine2: 'Apto 401',
  city: 'Medellin',
  region: 'Antioquia',
  country: 'CO',
  postalCode: '050001',
  instructions: 'Porteria torre 2',
  cardNumber: '4242424242424242',
  cvc: '123',
  expMonth: '12',
  expYear: '28',
  cardHolder: 'JANE DOE',
  installments: 1,
}

export function PaymentDeliveryForm({ onSubmit, submitLabel }: PaymentDeliveryFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<PaymentDeliveryFormValues>({
    resolver: zodResolver(paymentDeliverySchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues,
  })
  const cardNumber = useWatch({ control, name: 'cardNumber' })
  const brand = useMemo(() => getCardBrand(cardNumber), [cardNumber])

  function getFieldError(name: keyof PaymentDeliveryFormValues) {
    if (!touchedFields[name] && !isSubmitted) return undefined
    return errors[name]?.message
  }

  function getInputProps(name: keyof PaymentDeliveryFormValues) {
    const field = register(name)
    return {
      ...field,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        event.target.value = sanitizeByField(name, event.target.value)
        field.onChange(event)
      },
    }
  }

  function onValid(values: PaymentDeliveryFormValues) {
    onSubmit({
      customer: {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        documentType: values.documentType,
        documentNumber: values.documentNumber,
      },
      delivery: {
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        region: values.region,
        country: values.country,
        postalCode: values.postalCode,
        instructions: values.instructions,
      },
      paymentDraft: {
        cardNumber: values.cardNumber,
        cvc: values.cvc,
        expMonth: values.expMonth,
        expYear: values.expYear,
        cardHolder: values.cardHolder,
        installments: values.installments,
        email: values.email,
      },
    })
  }

  function fillTestData() {
    const entries = Object.entries(autofillValues) as [keyof PaymentDeliveryFormValues, string | number][]
    entries.forEach(([name, value]) => {
      setValue(name, value as never, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
    })
    void trigger()
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onValid)}>
      <div className="flex justify-end">
        <Button onClick={fillTestData} type="button" variant="outline">
          Rellenar datos de prueba
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <FormField error={getFieldError('fullName')} label="Nombre completo">
          <Input aria-invalid={Boolean(errors.fullName)} placeholder="Nombre completo" {...getInputProps('fullName')} />
        </FormField>
        <FormField error={getFieldError('email')} label="Correo">
          <Input aria-invalid={Boolean(errors.email)} placeholder="Correo" {...getInputProps('email')} />
        </FormField>
        <FormField error={getFieldError('phone')} label="Telefono">
          <Input aria-invalid={Boolean(errors.phone)} placeholder="Telefono" {...getInputProps('phone')} />
        </FormField>
        <FormField error={getFieldError('documentType')} label="Tipo documento">
          <Input aria-invalid={Boolean(errors.documentType)} placeholder="Tipo doc (CC)" {...getInputProps('documentType')} />
        </FormField>
        <FormField error={getFieldError('documentNumber')} label="Numero documento">
          <Input
            aria-invalid={Boolean(errors.documentNumber)}
            placeholder="Numero documento"
            {...getInputProps('documentNumber')}
          />
        </FormField>
        <FormField error={getFieldError('addressLine1')} label="Direccion principal">
          <Input aria-invalid={Boolean(errors.addressLine1)} placeholder="Direccion" {...getInputProps('addressLine1')} />
        </FormField>
        <FormField error={getFieldError('addressLine2')} label="Direccion adicional">
          <Input
            aria-invalid={Boolean(errors.addressLine2)}
            placeholder="Direccion adicional"
            {...getInputProps('addressLine2')}
          />
        </FormField>
        <FormField error={getFieldError('city')} label="Ciudad">
          <Input aria-invalid={Boolean(errors.city)} placeholder="Ciudad" {...getInputProps('city')} />
        </FormField>
        <FormField error={getFieldError('region')} label="Region">
          <Input aria-invalid={Boolean(errors.region)} placeholder="Region" {...getInputProps('region')} />
        </FormField>
        <FormField error={getFieldError('country')} label="Pais">
          <Input aria-invalid={Boolean(errors.country)} placeholder="Pais (CO)" {...getInputProps('country')} />
        </FormField>
        <FormField error={getFieldError('postalCode')} label="Codigo postal">
          <Input aria-invalid={Boolean(errors.postalCode)} placeholder="Codigo postal" {...getInputProps('postalCode')} />
        </FormField>
        <FormField error={getFieldError('instructions')} label="Instrucciones">
          <Input
            aria-invalid={Boolean(errors.instructions)}
            placeholder="Instrucciones entrega"
            {...getInputProps('instructions')}
          />
        </FormField>
        <FormField error={getFieldError('cardNumber')} label="Numero tarjeta">
          <Input
            aria-invalid={Boolean(errors.cardNumber)}
            placeholder="Numero tarjeta"
            {...getInputProps('cardNumber')}
          />
        </FormField>
        <div className="flex items-end pb-2">
          <Badge variant="secondary">Marca detectada: {brand}</Badge>
        </div>
        <FormField error={getFieldError('cvc')} label="CVC">
          <Input aria-invalid={Boolean(errors.cvc)} placeholder="CVC" {...getInputProps('cvc')} />
        </FormField>
        <FormField error={getFieldError('expMonth')} label="Mes expiracion">
          <Input aria-invalid={Boolean(errors.expMonth)} placeholder="MM" {...getInputProps('expMonth')} />
        </FormField>
        <FormField error={getFieldError('expYear')} label="Anio expiracion">
          <Input aria-invalid={Boolean(errors.expYear)} placeholder="AA" {...getInputProps('expYear')} />
        </FormField>
        <FormField error={getFieldError('cardHolder')} label="Titular tarjeta">
          <Input aria-invalid={Boolean(errors.cardHolder)} placeholder="Titular" {...getInputProps('cardHolder')} />
        </FormField>
        <FormField error={getFieldError('installments')} label="Cuotas">
          <Input
            aria-invalid={Boolean(errors.installments)}
            inputMode="numeric"
            placeholder="Cuotas"
            type="text"
            {...register('installments', {
              valueAsNumber: true,
              setValueAs: (value) => Number(sanitizeByField('installments', String(value))),
              onChange: (event) => {
                event.target.value = sanitizeByField('installments', String(event.target.value))
              },
            })}
          />
        </FormField>
      </div>
      {Object.keys(errors).length > 0 && (
        <Alert>Revisa los campos marcados para poder continuar al resumen.</Alert>
      )}
      <Button className="w-full" type="submit">
        {submitLabel}
      </Button>
    </form>
  )
}
