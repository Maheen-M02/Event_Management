import React from 'react';
import { Calendar, MapPin, Clock, Edit, Trash2 } from 'lucide-react';
import { Event } from '../lib/supabase';

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  showActions?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onEdit, 
  onDelete, 
  showActions = false 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const { day, date, month, time } = formatDate(event.date);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.02] group">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Date Display */}
          <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg p-3 text-center min-w-[80px]">
            <div className="text-xs font-medium opacity-90">{day}</div>
            <div className="text-xl font-bold">{date}</div>
            <div className="text-xs font-medium opacity-90">{month}</div>
          </div>

          {/* Event Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {event.title}
            </h3>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
              {event.description}
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
            View Details →
          </button>
          
          {showActions && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit?.(event)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit event"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete?.(event)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};