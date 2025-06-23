import { NextRequest, NextResponse } from 'next/server';
import { getDevelopers, saveDeveloper, deleteDeveloper } from '@/lib/appwrite';
import { Developer } from '@/types';

export async function GET() {
  try {
    const developers = await getDevelopers();
    return NextResponse.json({ developers });
  } catch (error) {
    console.error('Error fetching developers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch developers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const developer: Developer = await request.json();
    const savedDeveloper = await saveDeveloper(developer);
    return NextResponse.json({ developer: savedDeveloper });
  } catch (error) {
    console.error('Error saving developer:', error);
    return NextResponse.json(
      { error: 'Failed to save developer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const developerId = searchParams.get('id');
    
    if (!developerId) {
      return NextResponse.json(
        { error: 'Developer ID is required' },
        { status: 400 }
      );
    }

    await deleteDeveloper(developerId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting developer:', error);
    return NextResponse.json(
      { error: 'Failed to delete developer' },
      { status: 500 }
    );
  }
}