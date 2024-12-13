import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ItineraryForm from '@/components/ItineraryForm'

describe('ItineraryForm', () => {
    const mockProps = {
        searchState: {
            city: '',
            country: '',
            days: 1,
            budget: '$',
            preferred_activities: []
        },
        setSearchState: jest.fn(),
        loading: false,
        onSubmit: jest.fn()
    }

    it('renders the form fields', () => {
        render(<ItineraryForm {...mockProps} />)
        
        expect(screen.getByText(/where do you want to go/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/enter city/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/enter country/i)).toBeInTheDocument()
    })

    it('handles city input change', async () => {
        const user = userEvent.setup()
        render(<ItineraryForm {...mockProps} />)

        const cityInput = screen.getByPlaceholderText(/enter city/i)
        await user.type(cityInput, 'Tokyo')

        expect(mockProps.setSearchState).toHaveBeenCalled()
    })

    it('handles activity selection', async () => {
        const user = userEvent.setup()
        render(<ItineraryForm {...mockProps} />)

        const diningButton = screen.getByRole('button', { name: /dining/i })
        await user.click(diningButton)

        expect(mockProps.setSearchState).toHaveBeenCalled()
    })

    it('shows loading state', () => {
        render(<ItineraryForm {...mockProps} loading={true} />)

        expect(screen.getByText(/planning your trip/i)).toBeInTheDocument()
    })
})