import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResultCard from '../components/ResultCard';

// Mock clipboard
const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Mock alert
window.alert = jest.fn();

describe('ResultCard', () => {
  const defaultProps = {
    result: 'Test result\n**Header**\nhttps://example.com',
    agency: 'Test Agency',
    action: 'Test Action',
    isMock: false,
  };

  it('renders the result text correctly', () => {
    render(<ResultCard {...defaultProps} />);
    expect(screen.getByText('Test result')).toBeInTheDocument();
    expect(screen.getByText('Header')).toHaveClass('font-bold');
    expect(screen.getByText('https://example.com')).toHaveAttribute('href', 'https://example.com');
  });

  it('shows placeholder when no result', () => {
    render(<ResultCard {...defaultProps} result="" />);
    expect(screen.getByText(/Your checklist and office location info will appear here/i)).toBeInTheDocument();
  });

  it('copies to clipboard when Copy button is clicked', async () => {
    render(<ResultCard {...defaultProps} />);
    const copyButton = screen.getByText('Copy');
    fireEvent.click(copyButton);
    expect(mockWriteText).toHaveBeenCalledWith(defaultProps.result);
  });

  it('opens verification link when Verify Info is clicked', () => {
    render(<ResultCard {...defaultProps} />);
    const verifyButton = screen.getByText('Verify Info');
    fireEvent.click(verifyButton);
    expect(mockOpen).toHaveBeenCalled();
  });

  it('shows mock mode warning when isMock is true', () => {
    render(<ResultCard {...defaultProps} isMock={true} />);
    expect(screen.getByText(/\* Running in Demo Mode/i)).toBeInTheDocument();
  });
});
