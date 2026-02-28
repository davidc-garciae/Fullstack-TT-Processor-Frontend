import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from '../../app/App'

function mockApiForHappyPath() {
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
    const method = init?.method ?? 'GET'

    if (url.endsWith('/products') && method === 'GET') {
      return new Response(
        JSON.stringify([
          {
            id: 'p-1',
            name: 'Producto Demo',
            description: 'Demo',
            priceCents: 259000,
            currency: 'COP',
            stockAvailable: 3,
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    }

    if (url.endsWith('/checkout/preview') && method === 'POST') {
      return new Response(
        JSON.stringify({
          productId: 'p-1',
          quantity: 1,
          currency: 'COP',
          productAmountCents: 259000,
          baseFeeCents: 1200,
          deliveryFeeCents: 2000,
          totalAmountCents: 262200,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    }

    if (url.endsWith('/transactions') && method === 'POST') {
      return new Response(JSON.stringify({ reference: 'TT-TEST-001', status: 'PENDING' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (url.endsWith('/transactions/TT-TEST-001/pay') && method === 'POST') {
      return new Response(JSON.stringify({ reference: 'TT-TEST-001', status: 'APPROVED' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (url.endsWith('/transactions/TT-TEST-001') && method === 'GET') {
      return new Response(
        JSON.stringify({
          reference: 'TT-TEST-001',
          status: 'APPROVED',
          processorStatus: 'APPROVED',
          totalAmountCents: 262200,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    }

    return new Response(JSON.stringify({ message: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  })
}

describe('App integration flow', () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    globalThis.history.replaceState({}, '', '/')
  })

  it('muestra el boton Pay with credit card y abre/cierra modal', async () => {
    mockApiForHappyPath()
    const user = userEvent.setup()
    render(<App />)

    await screen.findByRole('heading', { name: 'Producto' })
    expect(screen.getByRole('button', { name: 'Pay with credit card' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Pay with credit card' }))
    expect(screen.getByRole('dialog', { name: 'Pay with credit card' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Pay with credit card' })).not.toBeInTheDocument()
    })
  })

  it('muestra feedback inline y bloquea submit con datos invalidos', async () => {
    mockApiForHappyPath()
    const user = userEvent.setup()
    render(<App />)

    await screen.findByRole('heading', { name: 'Producto' })
    await user.click(screen.getByRole('button', { name: 'Pay with credit card' }))
    await screen.findByRole('dialog', { name: 'Pay with credit card' })

    fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'correo-invalido' } })
    fireEvent.blur(screen.getByPlaceholderText('Correo'))
    expect(await screen.findByText('Ingresa un correo valido.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ir al resumen' }))
    expect(screen.queryByRole('heading', { name: 'Resumen' })).not.toBeInTheDocument()
    expect(screen.getByText('Revisa los campos marcados para poder continuar al resumen.')).toBeInTheDocument()
  })

  it('permite autofill para avanzar rapido al resumen', async () => {
    mockApiForHappyPath()
    const user = userEvent.setup()
    render(<App />)

    await screen.findByRole('heading', { name: 'Producto' })
    await user.click(screen.getByRole('button', { name: 'Pay with credit card' }))
    await screen.findByRole('dialog', { name: 'Pay with credit card' })

    await user.click(screen.getByRole('button', { name: 'Rellenar datos de prueba' }))
    await user.click(screen.getByRole('button', { name: 'Ir al resumen' }))

    expect(await screen.findByRole('heading', { name: 'Resumen' })).toBeInTheDocument()
  })

  it('renderiza imagen de producto y aplica fallback si falla', async () => {
    mockApiForHappyPath()
    render(<App />)

    await screen.findByRole('heading', { name: 'Producto' })
    const productImage = await screen.findByRole('img', { name: 'Producto Demo' })
    expect(productImage).toHaveAttribute('src')

    fireEvent.error(productImage)
    await waitFor(() => {
      expect(productImage).toHaveAttribute('src', '/vite.svg')
    })
  })

  it('permite navegar producto -> modal -> resumen', async () => {
    mockApiForHappyPath()
    const user = userEvent.setup()
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Producto' })).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '1' } })
    await user.click(screen.getByRole('button', { name: 'Pay with credit card' }))
    expect(await screen.findByRole('dialog', { name: 'Pay with credit card' })).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Telefono'), { target: { value: '3001112233' } })
    fireEvent.change(screen.getByPlaceholderText('Tipo doc (CC)'), { target: { value: 'CC' } })
    fireEvent.change(screen.getByPlaceholderText('Numero documento'), { target: { value: '1234567' } })
    fireEvent.change(screen.getByPlaceholderText('Direccion'), { target: { value: 'Street 1 #2-3' } })
    fireEvent.change(screen.getByPlaceholderText('Ciudad'), { target: { value: 'Medellin' } })
    fireEvent.change(screen.getByPlaceholderText('Region'), { target: { value: 'Antioquia' } })
    fireEvent.change(screen.getByPlaceholderText('Pais (CO)'), { target: { value: 'CO' } })
    fireEvent.change(screen.getByPlaceholderText('Codigo postal'), { target: { value: '050001' } })
    fireEvent.change(screen.getByPlaceholderText('Numero tarjeta'), {
      target: { value: '4242424242424242' },
    })
    fireEvent.change(screen.getByPlaceholderText('CVC'), { target: { value: '123' } })
    fireEvent.change(screen.getByPlaceholderText('MM'), { target: { value: '12' } })
    fireEvent.change(screen.getByPlaceholderText('AA'), { target: { value: '28' } })
    fireEvent.change(screen.getByPlaceholderText('Titular'), { target: { value: 'JANE DOE' } })

    await user.click(screen.getByRole('button', { name: 'Ir al resumen' }))

    expect(await screen.findByRole('heading', { name: 'Resumen' })).toBeInTheDocument()
    expect(await screen.findByText('Total')).toBeInTheDocument()
  })

  it('procesa pago y muestra estado final', async () => {
    mockApiForHappyPath()
    const user = userEvent.setup()
    render(<App />)

    await screen.findByRole('heading', { name: 'Producto' })
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '1' } })
    await user.click(screen.getByRole('button', { name: 'Pay with credit card' }))
    await screen.findByRole('dialog', { name: 'Pay with credit card' })
    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Telefono'), { target: { value: '3001112233' } })
    fireEvent.change(screen.getByPlaceholderText('Tipo doc (CC)'), { target: { value: 'CC' } })
    fireEvent.change(screen.getByPlaceholderText('Numero documento'), { target: { value: '1234567' } })
    fireEvent.change(screen.getByPlaceholderText('Direccion'), { target: { value: 'Street 1 #2-3' } })
    fireEvent.change(screen.getByPlaceholderText('Ciudad'), { target: { value: 'Medellin' } })
    fireEvent.change(screen.getByPlaceholderText('Region'), { target: { value: 'Antioquia' } })
    fireEvent.change(screen.getByPlaceholderText('Pais (CO)'), { target: { value: 'CO' } })
    fireEvent.change(screen.getByPlaceholderText('Codigo postal'), { target: { value: '050001' } })
    fireEvent.change(screen.getByPlaceholderText('Numero tarjeta'), {
      target: { value: '4242424242424242' },
    })
    fireEvent.change(screen.getByPlaceholderText('CVC'), { target: { value: '123' } })
    fireEvent.change(screen.getByPlaceholderText('MM'), { target: { value: '12' } })
    fireEvent.change(screen.getByPlaceholderText('AA'), { target: { value: '28' } })
    fireEvent.change(screen.getByPlaceholderText('Titular'), { target: { value: 'JANE DOE' } })
    await user.click(screen.getByRole('button', { name: 'Ir al resumen' }))

    await screen.findByRole('heading', { name: 'Resumen' })
    await user.click(screen.getByRole('button', { name: 'Pagar' }))

    expect(await screen.findByRole('heading', { name: 'Estado final' })).toBeInTheDocument()
    expect(await screen.findByText(/Aprobada/i)).toBeInTheDocument()
  })

  it('normaliza sesion local al cargar producto', async () => {
    localStorage.setItem(
      'tt.checkout',
      JSON.stringify({
        reference: 'TT-TEST-001',
        idempotencyKey: 'idem-1',
      }),
    )
    mockApiForHappyPath()

    render(<App />)

    await waitFor(() => {
      expect(localStorage.getItem('tt.checkout')).toBe('{}')
    })
  })
})
