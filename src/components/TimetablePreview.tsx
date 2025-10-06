import React from 'react';
import { X, Download, User, MapPin, BookOpen } from 'lucide-react';
import { GeneratedTimetable } from '../types';

interface TimetablePreviewProps {
  timetable: GeneratedTimetable;
  subjects: any[];
  faculty: any[];
  classrooms: any[];
  batches: any[];
  onClose: () => void;
  onExport: () => void;
}

export function TimetablePreview({
  timetable,
  subjects,
  faculty,
  classrooms,
  batches,
  onClose,
  onExport
}: TimetablePreviewProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const timeSlotStrings = Array.from(
    new Set(
      timetable.entries.map(
        entry => `${entry.timeSlot.startTime}-${entry.timeSlot.endTime}`
      )
    )
  ).sort();

  const getClassForTimeSlot = (day: string, timeSlot: string) => {
    return timetable.entries.find(entry => {
      const entryTime = `${entry.timeSlot.startTime}-${entry.timeSlot.endTime}`;
      return entry.day === day && entryTime === timeSlot;
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'theory':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'practical':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'tutorial':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{timetable.name}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-600">
                Score: <span className="font-semibold text-blue-600">{timetable.score}%</span>
              </span>
              <span className="text-sm text-gray-600">
                Generated: {timetable.generatedAt.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onExport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Download size={16} className="mr-2" />
              Export PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-blue-600 text-sm font-medium">Classroom Utilization</div>
            <div className="text-blue-900 text-xl font-bold">
              {timetable.metrics.classroomUtilization}%
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-green-600 text-sm font-medium">Faculty Balance</div>
            <div className="text-green-900 text-xl font-bold">
              {timetable.metrics.facultyWorkloadBalance}%
            </div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-yellow-600 text-sm font-medium">Conflicts</div>
            <div className="text-yellow-900 text-xl font-bold">
              {timetable.metrics.conflictCount}
            </div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-orange-600 text-sm font-medium">Preference Match</div>
            <div className="text-orange-900 text-xl font-bold">
              {timetable.metrics.preferenceMatch}%
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Time
                </th>
                {days.map(day => (
                  <th
                    key={day}
                    className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlotStrings.map(timeSlot => (
                <tr key={timeSlot}>
                  <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                    {timeSlot}
                  </td>
                  {days.map(day => {
                    const classEntry = getClassForTimeSlot(day, timeSlot);
                    const subject = classEntry
                      ? subjects.find(s => s.id === classEntry.subjectId)
                      : null;
                    const facultyMember = classEntry
                      ? faculty.find(f => f.id === classEntry.facultyId)
                      : null;
                    const classroom = classEntry
                      ? classrooms.find(c => c.id === classEntry.classroomId)
                      : null;
                    const batch = classEntry
                      ? batches.find(b => b.id === classEntry.batchId)
                      : null;

                    return (
                      <td key={`${day}-${timeSlot}`} className="border border-gray-200 p-2">
                        {classEntry ? (
                          <div
                            className={`p-3 rounded-lg border-2 ${getTypeColor(
                              subject?.type || 'theory'
                            )} min-h-[80px]`}
                          >
                            <div className="font-medium text-sm mb-1">
                              {subject?.name || 'Unknown Subject'}
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              {subject?.code || 'N/A'}
                            </div>
                            <div className="text-xs flex items-center mb-1">
                              <User size={12} className="mr-1" />
                              {facultyMember?.name || 'Unknown'}
                            </div>
                            <div className="text-xs flex items-center mb-1">
                              <MapPin size={12} className="mr-1" />
                              {classroom?.name || 'Unknown'}
                            </div>
                            <div className="text-xs flex items-center">
                              <BookOpen size={12} className="mr-1" />
                              {batch?.name || 'Unknown'}
                            </div>
                          </div>
                        ) : (
                          <div className="h-20"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
